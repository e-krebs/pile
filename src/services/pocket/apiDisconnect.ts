import { deleteJson, getJsonKey } from 'utils/files';
import { getQueryKeys } from './const';
import { deleteAllKeys } from './helpers';

export const disconnect = async () => {
  deleteAllKeys();
  await deleteJson(getJsonKey(getQueryKeys));
  chrome.browserAction.setBadgeText({});
};
