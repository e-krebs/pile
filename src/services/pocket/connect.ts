import { post } from 'utils/post';
import { headers } from './const';
import { getPocketKey, getPocketRedirectUri, setPocketCode } from './helpers';

interface PocketRequest {
  code: string;
}

export const connect = async (): Promise<boolean> => {
  const response = await post<PocketRequest>({
    url: 'https://getpocket.com/v3/oauth/request',
    headers,
    params: { consumer_key: getPocketKey(), redirect_uri: getPocketRedirectUri() },
  });

  if (!response.ok || !response.result.code) {
    return false;
  }

  const {
    result: { code },
  } = response;
  await setPocketCode(code);
  const redirectUri = getPocketRedirectUri();
  chrome.tabs.create({
    url: `https://getpocket.com/auth/authorize?request_token=${code}&redirect_uri=${redirectUri}`,
  });

  return true;
};
