export const getLocalStorageValue = async <T extends string>(
  dict: Record<T, string>,
  key: T,
): Promise<string | undefined> => {
  const value = await chrome.storage.local.get(dict[key]);
  if (!value || !value[dict[key]]) return undefined;
  return value[dict[key]].toString();
};

export const setLocalStorageValue = async <T extends string>(
  dict: Record<T, string>,
  key: T,
  value: string,
): Promise<void> => await chrome.storage.local.set({ [dict[key]]: value });

export const deleteLocalStorageValue = async <T extends string>(
  dict: Record<T, string>,
  key: T,
): Promise<void> => await chrome.storage.local.remove(dict[key]);

export const getFromLocalStorage = async <T>(key: string): Promise<T | undefined> => {
  const value = await chrome.storage.local.get(key);
  if (!value || value[key] === undefined) return undefined;
  return value[key] as T;
};

export const setToLocalStorage = async <T>(key: string, value: T): Promise<void> =>
  await chrome.storage.local.set({ [key]: value });

export const deleteFromLocalStorage = async (key: string): Promise<void> =>
  await chrome.storage.local.remove(key);
