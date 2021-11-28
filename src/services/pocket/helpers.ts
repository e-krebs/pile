import { getEnvVar } from 'helpers/env';
import {
  getLocalStorageValue as get,
  setLocalStorageValue as set,
  deleteLocalStorageValue as del
} from 'helpers/localstorage';

type Keys = 'code' | 'token' | 'username';
const localStorageKeys: Record<Keys, string> = {
  code: 'pocketCode',
  token: 'pocketToken',
  username: 'pocketUsername'
};

const getKeys = (): Keys[] => Object.keys(localStorageKeys) as Keys[];

export const isConnected = (): boolean => getKeys()
  .map((key) => Boolean(get(localStorageKeys, key)))
  .reduce((a, b) => a && b);

export const deleteAllKeys = () => getKeys().forEach((key) => del(localStorageKeys, key));

export const getPocketKey = (): string | undefined => getEnvVar('pocketKey');
export const getPocketRedirectUri = (): string =>
  chrome.extension.getURL('services/pocket/oauth.html');

export const getPocketCode = () => get(localStorageKeys, 'code');
export const setPocketCode = (code: string) =>
  set(localStorageKeys, 'code', code);

export const getPocketToken = () => get(localStorageKeys, 'token');
export const setPocketToken = (token: string) =>
  set(localStorageKeys, 'token', token);

export const getPocketUsername = () => get(localStorageKeys, 'username');
export const setPocketUsername = (username: string) =>
  set(localStorageKeys, 'username', username);
