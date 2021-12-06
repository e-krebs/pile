import { getTimestamp, isCacheExpired, JsonArrayCache } from './dataCache';
import { getJsonKey, readJson, writeJson } from './files';
import { Service } from './services';
import { ListItem } from './typings';

type GetType = 'default' | 'force' | 'search';

export type GetParams = {
  type: Exclude<GetType, 'search'>;
} | {
  type: 'search';
  search: string;
}

const rawGet = async (
  param: GetParams,
  service: Service
): Promise<JsonArrayCache<ListItem>> => {
  if (!service.isConnected()) throw Error('not connected to pocket');

  const key = getJsonKey(service.getQueryKey);
  let list = await readJson<JsonArrayCache<ListItem>>([key]);

  if (param.type !== 'default' || !list || isCacheExpired(list)) {
    const data = await service.get(param);
    list = { timestamp: getTimestamp(), data };
    if (param.type !== 'search') {
      await writeJson<JsonArrayCache<ListItem>>([key], list);
    }
  }

  return list;
};

export const get = async (service: Service) => await rawGet({ type: 'default' }, service);
export const forceGet = async (service: Service) => await rawGet({ type: 'force' }, service);
export const search = async (search: string, service: Service) =>
  await rawGet({ type: 'search', search }, service);
