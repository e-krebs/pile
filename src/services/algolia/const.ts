export const name = 'algolia';
export const getQueryKey = 'algoliaList';

export type LocalStorageKeys = 'AppId' | 'ApiKey' | 'IndexName';
export const localStorageKeyCodes: Record<LocalStorageKeys, string> = {
  AppId: 'algoliaAppId',
  ApiKey: 'algoliaApiKey',
  IndexName: 'algoliaIndexName',
};
