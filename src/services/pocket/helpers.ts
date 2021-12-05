import { getEnvVar } from 'helpers/env';
import {
  getLocalStorageValue as get,
  setLocalStorageValue as set,
  deleteLocalStorageValue as del
} from 'helpers/localstorage';
import { getServiceOauthUrl } from 'utils/services';
import { name, LocalStorageKeys, localStorageKeyCodes } from './const';

const getKeys = (): LocalStorageKeys[] => Object.keys(localStorageKeyCodes) as LocalStorageKeys[];

export const isConnected = (): boolean => getKeys()
  .map((key) => Boolean(get(localStorageKeyCodes, key)))
  .reduce((a, b) => a && b);

export const deleteAllKeys = () => getKeys().forEach((key) => del(localStorageKeyCodes, key));

export const getPocketKey = (): string | undefined => getEnvVar('pocketKey');
export const getPocketRedirectUri = (): string => getServiceOauthUrl(name);

export const getPocketCode = () => get(localStorageKeyCodes, 'code');
export const setPocketCode = (code: string) =>
  set(localStorageKeyCodes, 'code', code);

export const getPocketToken = () => get(localStorageKeyCodes, 'token');
export const setPocketToken = (token: string) =>
  set(localStorageKeyCodes, 'token', token);

export const getPocketUsername = () => get(localStorageKeyCodes, 'username');
export const setPocketUsername = (username: string) =>
  set(localStorageKeyCodes, 'username', username);
