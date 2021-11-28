import {
  getPocketCode,
  getPocketKey,
  getPocketRedirectUri,
  getPocketToken,
  isConnected,
  setPocketCode,
  setPocketToken,
  setPocketUsername
} from './helpers';
import { post } from 'utils/post';
import { PocketAuthorize, PocketItem, PocketList, PocketRequest, PocketSend } from './apiTyping';
import { getJsonKey, readJson, writeJson } from 'utils/files';
import { getTimestamp, isCacheExpired, JsonCache } from 'utils/dataCache';
import { color } from 'helpers/vars';

const headers: Record<string, string> = {
  'Host': 'getpocket.com',
  'Content-Type': 'application/json; charset=UTF-8',
  'X-Accept': 'application/json'
};

export const queryKeys = {
  get: 'pocketList'
};

export const connect = async (): Promise<boolean> => {
  const response = await post<PocketRequest>({
    url: 'https://getpocket.com/v3/oauth/request',
    headers,
    params: { consumer_key: getPocketKey(), redirect_uri: getPocketRedirectUri() },
  });

  if (!response.ok || !response.result.code) {
    return false;
  }

  const { result: { code } } = response;
  setPocketCode(code);
  const redirectUri = getPocketRedirectUri();
  chrome.tabs.create({
    url: `https://getpocket.com/auth/authorize?request_token=${code}&redirect_uri=${redirectUri}`
  });

  return true;
};

export const authorize = async (): Promise<boolean> => {
  if (isConnected()) return true;

  const response = await post<PocketAuthorize>({
    url: 'https://getpocket.com/v3/oauth/authorize',
    headers,
    params: { consumer_key: getPocketKey(), code: getPocketCode() },
  });

  if (!response.ok || !response.result.access_token || !response.result.username) {
    return false;
  }
  const { result: { access_token: token, username } } = response;
  setPocketToken(token);
  setPocketUsername(username);
  return true;
};

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

export const deleteItem = async (item_id: string): Promise<boolean> =>
  await action(item_id, 'delete');

export const archiveItem = async (item_id: string): Promise<boolean> =>
  await action(item_id, 'archive');

const rawGet = async (force: boolean): Promise<JsonCache<PocketItem>> => {
  if (!isConnected()) throw Error('not connected to pocket');

  const key = getJsonKey(queryKeys.get);
  let list = await readJson<JsonCache<PocketItem>>([key]);

  if (force || !list || isCacheExpired(list)) {
    const response = await post<PocketList>({
      url: 'https://getpocket.com/v3/get',
      headers,
      params: { consumer_key: getPocketKey(), access_token: getPocketToken(), sort: 'newest' }
    });
    if (!response.ok) throw Error('couldn\'t get pocket list');

    const data: PocketItem[] = Object.values(response.result.list)
      .sort((a, b) => a.time_updated < b.time_updated ? 1 : -1);
    list = { timestamp: getTimestamp(), data };
    await writeJson<JsonCache<PocketItem>>([key], list);
  }

  chrome.browserAction.setBadgeBackgroundColor({ color });
  chrome.browserAction.setBadgeText({ text: list.data.length.toString() });

  return list;
};

export const get = async () => rawGet(false);
export const forceGet = async () => rawGet(true);
