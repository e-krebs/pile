export const getLocalStorageValue = <T extends string>(
  dict: Record<T, string>,
  key: T
): string | undefined => localStorage.getItem(dict[key]) ?? undefined;

export const setLocalStorageValue = <T extends string>(
  dict: Record<T, string>,
  key: T,
  value: string
): void => localStorage.setItem(dict[key], value);

export const deleteLocalStorageValue = <T extends string>(dict: Record<T, string>, key: T): void =>
  localStorage.removeItem(dict[key]);
