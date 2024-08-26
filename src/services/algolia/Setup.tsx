import { createFetchRequester } from '@algolia/requester-fetch';
import { Button, TextInput } from '@e-krebs/react-library';
import { FC, useCallback, useEffect, useState } from 'react';
import algoliasearch from 'algoliasearch';
import { CheckCircle, XCircle } from 'react-feather';

import {
  getLocalStorageValue,
  setLocalStorageValue,
  deleteLocalStorageValue,
} from 'helpers/localstorage';
import { type ComponentContext } from 'utils/services';

import { LocalStorageKeys, localStorageKeyCodes } from './const';

const algoliaSearchOptions = { requester: createFetchRequester() };

export const Setup: FC<{ context: ComponentContext }> = ({ context }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState<{ apiKey: boolean; indexName: boolean }>({
    apiKey: false,
    indexName: false,
  });
  const [values, setValues] = useState<Record<LocalStorageKeys, string | undefined>>({
    AppId: undefined,
    ApiKey: undefined,
    IndexName: undefined,
  });

  const validate = useCallback(async () => {
    if (values.AppId && values.ApiKey) {
      try {
        const searchClient = algoliasearch(values.AppId, values.ApiKey, algoliaSearchOptions);
        const apiKeys = await searchClient.getApiKey(values.ApiKey);
        if (apiKeys.acl.length === 1 && apiKeys.acl[0] === 'search') {
          if (values.IndexName) {
            try {
              await searchClient.initIndex(values.IndexName).search('');
              setIsValid({ apiKey: true, indexName: true });
              return;
            } catch (e) {
              /* empty */
            }
          }
          setIsValid({ apiKey: true, indexName: false });
          return;
        }
      } catch (e) {
        /* empty */
      }
    }
    setIsValid({ apiKey: false, indexName: false });
  }, [values.ApiKey, values.AppId, values.IndexName]);

  useEffect(() => {
    Promise.all<string | undefined>([
      getLocalStorageValue(localStorageKeyCodes, 'AppId'),
      getLocalStorageValue(localStorageKeyCodes, 'ApiKey'),
      getLocalStorageValue(localStorageKeyCodes, 'IndexName'),
    ])
      .then(([AppId, ApiKey, IndexName]) => {
        setValues({ AppId, ApiKey, IndexName });
      })
      .then(validate)
      .then(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    validate();
  }, [validate, values.ApiKey, values.AppId, values.IndexName]);

  const updateValue = async (stringValue: string, key: keyof typeof localStorageKeyCodes) => {
    const value = stringValue || undefined;
    if (!value) {
      setValues((values) => ({ ...values, [key]: undefined }));
      await deleteLocalStorageValue(localStorageKeyCodes, key);
    } else {
      setValues((values) => ({ ...values, [key]: value }));
      await setLocalStorageValue(localStorageKeyCodes, key, value);
    }
  };

  return (
    <div className="space-y-6 p-3 pb-9">
      <h2 className="text-2xl font-bold">Setup Algolia</h2>
      {!isLoading && (
        <div className="grid grid-cols-2 items-end gap-x-3 gap-y-6">
          <TextInput
            border="none"
            label="Algolia Application ID"
            defaultValue={values.AppId}
            onChange={(value) => updateValue(value, 'AppId')}
            flowClassName="w-full"
          />
          <div />
          <TextInput
            border="none"
            label="Algolia Search-Only API Key"
            defaultValue={values.ApiKey}
            onChange={(value) => updateValue(value, 'ApiKey')}
            type="password"
            flowClassName="w-full"
          />
          {isValid.apiKey ? (
            <div className="flex items-center gap-x-3 p-1 text-green-500">
              <CheckCircle size={24} />
              <span>Api Key is valid</span>
            </div>
          ) : (
            <div className="flex items-center gap-x-3 p-1 text-red-500">
              <XCircle size={24} />
              <span>Api Key is invalid</span>
            </div>
          )}
          <TextInput
            border="none"
            label="Algolia Index Name"
            defaultValue={values.IndexName}
            onChange={(value) => updateValue(value, 'IndexName')}
            flowClassName="w-full"
          />
          {isValid.indexName ? (
            <div className="flex items-center gap-x-3 p-1 text-green-500">
              <CheckCircle size={24} />
              <span>Index Name is valid</span>
            </div>
          ) : (
            <div className="flex items-center gap-x-3 p-1 text-red-500">
              <XCircle size={24} />
              <span>Index Name is invalid</span>
            </div>
          )}
          {context === 'popup' && (
            <Button
              isDisabled={!isValid.apiKey || !isValid.indexName}
              onPress={() => window.location.reload()}
            >
              Reload to see Algolia list
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
