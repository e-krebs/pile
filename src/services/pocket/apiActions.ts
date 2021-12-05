import { post } from 'utils/post';
import { headers } from './const';
import { getPocketKey, getPocketToken } from './helpers';

interface PocketSend {
  action_results: boolean[];
}

const action = async (item_id: string, action: 'delete' | 'archive'): Promise<boolean> => {
  const response = await post<PocketSend>({
    url: 'https://getpocket.com/v3/send',
    headers,
    params: {
      consumer_key: getPocketKey(),
      access_token: getPocketToken(),
      actions: [{ action, item_id }]
    }
  });
  if (!response.ok) return false;
  return response.result.action_results[0];
};

export const deleteItem = async (id: string): Promise<boolean> => await action(id, 'delete');

export const archiveItem = async (id: string): Promise<boolean> => await action(id, 'archive');
