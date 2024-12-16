import { getFromLocalStorage, setToLocalStorage, deleteFromLocalStorage } from 'helpers/localstorage';

const getLastTagKey = (serviceName: string) => `${serviceName}-last-tag`;

export const getLastTag = async (serviceName: string): Promise<string | null | undefined> =>
  await getFromLocalStorage<string | null>(getLastTagKey(serviceName));

export const setLastTag = async (serviceName: string, tag: string | null | undefined): Promise<void> => {
  return tag === undefined
    ? await deleteFromLocalStorage(getLastTagKey(serviceName))
    : await setToLocalStorage(getLastTagKey(serviceName), tag);
};
