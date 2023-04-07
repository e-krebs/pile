const getLastTagKey = (serviceName: string) => `${serviceName}-last-tag`;

export const getLastTag = async (serviceName: string): Promise<string | null | undefined> => {
  const key = getLastTagKey(serviceName);
  const value = await chrome.storage.local.get();
  return value ? value[key] : undefined;
};

export const setLastTag = async (serviceName: string, tag: string | null | undefined): Promise<void> => {
  const key = getLastTagKey(serviceName);
  tag === undefined
    ? await chrome.storage.local.remove(key)
    : await chrome.storage.local.set({ [key]: tag });
};
