import { getPocketKey, getPocketToken, isConnected } from './helpers';
import { post } from 'utils/post';
import { ListItem } from 'utils/typings';
import { getJsonKey, readJson, writeJson } from 'utils/files';
import { getTimestamp, isCacheExpired, JsonArrayCache } from 'utils/dataCache';
import { getQueryKey, headers } from './const';
import { itemToListItem, PocketItem } from './item';

interface PocketList {
  list: Record<number, PocketItem>
}

type GetType = 'default' | 'force' | 'search';

type GetParams = {
  type: Exclude<GetType, 'search'>;
} | {
  type: 'search';
  search: string;
}

const rawGet = async (param: GetParams): Promise<JsonArrayCache<ListItem>> => {
  if (!isConnected()) throw Error('not connected to pocket');

  const key = getJsonKey(getQueryKey);
  let list = await readJson<JsonArrayCache<ListItem>>([key]);

  if (param.type !== 'default' || !list || isCacheExpired(list)) {
    const response = await post<PocketList>({
      url: 'https://getpocket.com/v3/get',
      headers,
      params: {
        consumer_key: getPocketKey(),
        access_token: getPocketToken(),
        sort: 'newest',
        search: param.type === 'search' ? param.search : undefined,
      }
    });
    if (!response.ok) throw Error('couldn\'t get pocket list');

    const data: PocketItem[] = Object.values(response.result.list)
      .sort((a, b) => a.time_updated < b.time_updated ? 1 : -1);
    list = { timestamp: getTimestamp(), data: data.map(itemToListItem) };
    if (param.type !== 'search') {
      await writeJson<JsonArrayCache<ListItem>>([key], list);
    }
  }

  return list;
};

export const get = async () => rawGet({ type: 'default' });
export const forceGet = async () => rawGet({ type: 'force' });
export const search = async (search: string) => rawGet({ type: 'search', search });
