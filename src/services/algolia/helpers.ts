import { createFetchRequester } from '@algolia/requester-fetch';
import { algoliasearch, type SearchResponse, type SearchParamsObject } from 'algoliasearch';

import { getLocalStorageValue, deleteLocalStorageValue } from 'helpers/localstorage';

import { type LocalStorageKeys, localStorageKeyCodes } from './const';

type SearchIndex = {
  search: <T = Record<string, unknown>>(params?: SearchParamsObject) => Promise<SearchResponse<T>>;
};

let searchIndex: SearchIndex | undefined;

export const getAlgoliaClient = async (): Promise<SearchIndex | undefined> => {
  if (searchIndex !== undefined) {
    return searchIndex;
  }

  const AppId = await getLocalStorageValue(localStorageKeyCodes, 'AppId');
  const ApiKey = await getLocalStorageValue(localStorageKeyCodes, 'ApiKey');
  const indexName = await getLocalStorageValue(localStorageKeyCodes, 'IndexName');

  if (!AppId || !ApiKey || !indexName) {
    return undefined;
  }

  try {
    const searchClient = algoliasearch(AppId, ApiKey, { requester: createFetchRequester() });
    searchIndex = {
      search: <T = Record<string, unknown>>(params?: SearchParamsObject) =>
        searchClient.search([{ indexName, params }]).then((res) => res.results[0] as SearchResponse<T>),
    };
    await searchIndex.search('');
    return searchIndex;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return undefined;
  }
};

export const isConnected = async (): Promise<boolean> => {
  const searchClient = await getAlgoliaClient();
  if (!searchClient) {
    return false;
  }
  const res = await searchClient.search('');

  return !!res.hits;
};

export const deleteAllKeys = async () =>
  await Promise.all(
    (Object.keys(localStorageKeyCodes) as LocalStorageKeys[]).map(
      async (key) => await deleteLocalStorageValue(localStorageKeyCodes, key),
    ),
  );
