import { post } from 'utils/post';
import { ListItem } from 'utils/typings';
import { GetParams } from 'utils/get';

import { getPocketKey, getPocketToken } from './helpers';
import { headers } from './const';
import { itemToListItem, PocketItem } from './item';

interface PocketList {
  list: Record<number, PocketItem>;
  total: string;
}

// limit from the doc
const count = 30;

export const get = async (param: GetParams): Promise<ListItem[]> => {
  const listItems: ListItem[] = [];
  let offset = 0;
  let total = 0;

  do {
    const response = await post<PocketList>({
      url: 'https://getpocket.com/v3/get',
      headers,
      params: {
        consumer_key: getPocketKey(),
        access_token: await getPocketToken(),
        sort: 'newest',
        search: param.type === 'search' ? param.search : undefined,
        tag: param.type === 'tag' ? param.tag ?? '_untagged_' : undefined,
        detailType: 'complete',
        state: 'unread',
        count,
        total: '1',
        offset,
      },
    });

    if (!response.ok) throw Error("couldn't get pocket list");

    listItems.push(
      ...Object.values(response.result.list)
        .sort((a, b) => (a.time_added < b.time_added ? 1 : -1))
        .map(itemToListItem)
    );

    total = parseInt(response.result.total);
    offset += count;
  } while (listItems.length < total);

  return listItems;
};
