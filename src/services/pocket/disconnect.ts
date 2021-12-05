import { deleteJson, getJsonKey } from 'utils/files';
import { getQueryKey } from './const';
import { deleteAllKeys } from './helpers';

export const disconnect = async () => {
  deleteAllKeys();
  await deleteJson(getJsonKey(getQueryKey));
};
