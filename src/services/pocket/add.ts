import { post } from 'utils/post';

import { getPocketKey, getPocketToken } from './helpers';
import { headers } from './const';
import { itemToListItem, type PocketItem } from './item';
import { type ListItem } from 'utils/typings';

interface AddResponse {
  item: PocketItem;
}

export const add = async (url: string, tags?: string[]): Promise<ListItem> => {
  const response = await post<AddResponse>({
    url: 'https://getpocket.com/v3/add',
    headers,
    params: {
      consumer_key: getPocketKey(),
      access_token: await getPocketToken(),
      url: encodeURI(url),
      tags: tags && tags.length > 0 ? tags.join(',') : undefined,
    },
  });

  if (!response.ok) throw Error(`couldn't add item to pocket "${url}"`);

  return itemToListItem(response.result.item)
};
