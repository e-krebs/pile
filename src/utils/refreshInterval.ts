import { getFromLocalStorage, setToLocalStorage } from 'helpers/localstorage';
import { defaultVars, vars } from 'helpers/vars';

export const getRefreshInterval = async (): Promise<number> =>
  (await getFromLocalStorage<number>(vars.refreshInterval)) ?? defaultVars.refreshInterval;

export const setRefreshInterval = async (interval: number) =>
  await setToLocalStorage(vars.refreshInterval, interval);
