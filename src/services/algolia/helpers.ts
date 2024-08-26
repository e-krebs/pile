import { createFetchRequester } from '@algolia/requester-fetch';
import algoliasearch, { type SearchIndex } from 'algoliasearch';

import { getLocalStorageValue, deleteLocalStorageValue } from 'helpers/localstorage';

import { type LocalStorageKeys, localStorageKeyCodes } from './const';

let searchIndex: SearchIndex | undefined;

export const getAlgoliaClient = async (): Promise<SearchIndex | undefined> => {
  if (searchIndex !== undefined) {
    return searchIndex;
  }

  const AppId = await getLocalStorageValue(localStorageKeyCodes, 'AppId');
  const ApiKey = await getLocalStorageValue(localStorageKeyCodes, 'ApiKey');
  const IndexName = await getLocalStorageValue(localStorageKeyCodes, 'IndexName');

  if (!AppId || !ApiKey || !IndexName) {
    return undefined;
  }

  try {
    const searchClient = algoliasearch(AppId, ApiKey, { requester: createFetchRequester() });
    searchIndex = searchClient.initIndex(IndexName);
    await searchIndex.search('');
    return searchIndex;
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
      async (key) => await deleteLocalStorageValue(localStorageKeyCodes, key)
    )
  );
