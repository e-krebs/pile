export const name = 'pocket';
export const getQueryKey = 'pocketList';

export type LocalStorageKeys = 'code' | 'token' | 'username';
export const localStorageKeyCodes: Record<LocalStorageKeys, string> = {
  code: 'pocketCode',
  token: 'pocketToken',
  username: 'pocketUsername'
};

export const headers: Record<string, string> = {
  'Host': 'getpocket.com',
  'Content-Type': 'application/json; charset=UTF-8',
  'X-Accept': 'application/json'
};
