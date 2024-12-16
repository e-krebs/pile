import { getEnvVar } from 'helpers/env';
import {
  getLocalStorageValue as get,
  setLocalStorageValue as set,
  deleteLocalStorageValue as del,
} from 'helpers/localstorage';

import { name, LocalStorageKeys, localStorageKeyCodes } from './const';

const getKeys = (): LocalStorageKeys[] => Object.keys(localStorageKeyCodes) as LocalStorageKeys[];

export const isConnected = async (): Promise<boolean> => {
  const values = await Promise.all(
    getKeys().map(async (key) => {
      const value = await get(localStorageKeyCodes, key);
      return Boolean(value);
    }),
  );
  return values.reduce((a, b) => a && b);
};

export const deleteAllKeys = async () =>
  await Promise.all(getKeys().map(async (key) => await del(localStorageKeyCodes, key)));

export const getPocketKey = (): string | undefined => getEnvVar('pocketKey');
export const getPocketRedirectUri = (): string => chrome.runtime.getURL(`src/pages/oauth/${name}.html`);

export const getPocketCode = async () => await get(localStorageKeyCodes, 'code');
export const setPocketCode = async (code: string) => await set(localStorageKeyCodes, 'code', code);

export const getPocketToken = async () => await get(localStorageKeyCodes, 'token');
export const setPocketToken = async (token: string) => await set(localStorageKeyCodes, 'token', token);

export const getPocketUsername = async () => await get(localStorageKeyCodes, 'username');
export const setPocketUsername = async (username: string) =>
  await set(localStorageKeyCodes, 'username', username);
