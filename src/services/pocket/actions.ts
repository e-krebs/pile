import { post } from 'utils/post';
import { headers } from './const';
import { getPocketKey, getPocketToken } from './helpers';

interface PocketSend {
  action_results: boolean[];
}

type PocketAction = 'delete' | 'archive' | 'tags_add' | 'tags_remove';
interface PocketActionItem {
  action: PocketAction;
  item_id: string;
  tags?: string;
}

const action = async (item_id: string, action: PocketAction, tags?: string[]): Promise<boolean> => {
  const actionItem: PocketActionItem = { action, item_id };
  if (tags && tags.length > 0 && action.startsWith('tag')) {
    actionItem.tags = tags.join(',');
  }
  const response = await post<PocketSend>({
    url: 'https://getpocket.com/v3/send',
    headers,
    params: {
      consumer_key: getPocketKey(),
      access_token: getPocketToken(),
      actions: [actionItem]
    }
  });
  if (!response.ok) return false;
  return response.result.action_results[0];
};

export const deleteItem = async (id: string): Promise<boolean> => await action(id, 'delete');

export const archiveItem = async (id: string): Promise<boolean> => await action(id, 'archive');

export const addTag = async (id: string, tag: string): Promise<boolean> =>
  await action(id, 'tags_add', [tag]);

export const removeTag = async (id: string, tag: string): Promise<boolean> =>
  await action(id, 'tags_remove', [tag]);
