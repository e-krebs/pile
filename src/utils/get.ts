import { getTimestamp, isCacheExpired, JsonArrayCache } from './dataCache';
import { Service } from './services';
import { ListItem } from './typings';

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

  const cache = await chrome.storage.local.get(service.getQueryKey);
  let list = (cache[service.getQueryKey] ?? null) as JsonArrayCache<ListItem> | null;

  if (param.type !== 'default' || !list || isCacheExpired(list)) {
    const data = await service.get(param);
    list = { timestamp: getTimestamp(), data };
    if (!['search', 'tag'].includes(param.type)) {
      await chrome.storage.local.set({ [service.getQueryKey]: list });
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
