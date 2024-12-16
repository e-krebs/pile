import { getFromLocalStorage, setToLocalStorage } from 'helpers/localstorage';

import { getTimestamp, isCacheExpired, JsonArrayCache } from './dataCache';
import { Service } from './services';
import { ListItem } from './typings';
import { getRefreshInterval } from './refreshInterval';

type GetType = 'default' | 'force' | 'search';

export type GetParams =
  | {
      type: Exclude<GetType, 'search'>;
    }
  | {
      type: 'search';
      search: string;
    }
  | {
      type: 'tag';
      tag: string | null;
    };

const rawGet = async (param: GetParams, service: Service): Promise<JsonArrayCache<ListItem>> => {
  if (!service.isConnected()) throw Error('not connected to pocket');

  let list = await getFromLocalStorage<JsonArrayCache<ListItem> | null>(service.getQueryKey);
  const refreshInterval = await getRefreshInterval();

  if (param.type !== 'default' || !list || isCacheExpired(list, refreshInterval)) {
    const data = await service.get(param);
    list = { timestamp: getTimestamp(), data };
    if (!['search', 'tag'].includes(param.type)) {
      await setToLocalStorage(service.getQueryKey, list);
    }
  }

  return list;
};

export const get = async (service: Service) => await rawGet({ type: 'default' }, service);
export const forceGet = async (service: Service) => await rawGet({ type: 'force' }, service);
export const search = async (search: string, service: Service) =>
  await rawGet({ type: 'search', search }, service);
export const filterTag = async (tag: string | null, service: Service) =>
  await rawGet({ type: 'tag', tag }, service);
