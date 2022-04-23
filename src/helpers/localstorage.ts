export const getLocalStorageValue = async <T extends string>(
  dict: Record<T, string>,
  key: T
): Promise<string | undefined> => {
  const value = await chrome.storage.local.get(dict[key]);
  if (!value || !value[dict[key]]) return undefined;
  return value[dict[key]].toString();
};

export const setLocalStorageValue = async <T extends string>(
  dict: Record<T, string>,
  key: T,
  value: string
): Promise<void> => await chrome.storage.local.set({ [dict[key]]: value });

export const deleteLocalStorageValue = async <T extends string>(
  dict: Record<T, string>,
  key: T
): Promise<void> => await chrome.storage.local.remove(dict[key]);
