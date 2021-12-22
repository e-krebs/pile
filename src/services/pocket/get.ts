import { getPocketKey, getPocketToken } from './helpers';
import { post } from 'utils/post';
import { ListItem } from 'utils/typings';
import { GetParams } from 'utils/get';
import { headers } from './const';
import { itemToListItem, PocketItem } from './item';

interface PocketList {
  list: Record<number, PocketItem>
}

export const get = async (param: GetParams): Promise<ListItem[]> => {
  const response = await post<PocketList>({
    url: 'https://getpocket.com/v3/get',
    headers,
    params: {
      consumer_key: getPocketKey(),
      access_token: getPocketToken(),
      sort: 'newest',
      search: param.type === 'search' ? param.search : undefined,
      tag: param.type === 'tag' ? param.tag ?? '_untagged_' : undefined,
      detailType: 'complete',
    }
  });

  if (!response.ok) throw Error('couldn\'t get pocket list');

  return Object.values(response.result.list)
    .sort((a, b) => a.time_added < b.time_added ? 1 : -1)
    .map(itemToListItem);
};
