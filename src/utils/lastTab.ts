import { getFromLocalStorage, setToLocalStorage, deleteFromLocalStorage } from 'helpers/localstorage';
import { type ServiceNames } from 'services';

const lastTabKey = 'last-tab';

export const getLastTab = async (): Promise<ServiceNames | undefined> =>
  await getFromLocalStorage<ServiceNames>(lastTabKey);

export const setLastTab = async (serviceName?: string): Promise<void> => {
  serviceName === undefined
    ? await deleteFromLocalStorage(lastTabKey)
    : await setToLocalStorage(lastTabKey, serviceName);
};
