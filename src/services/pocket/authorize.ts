import { post } from 'utils/post';
import { headers } from './const';
import { getPocketCode, getPocketKey, isConnected, setPocketToken, setPocketUsername } from './helpers';

interface PocketAuthorize {
  access_token: string;
  username: string;
}

export const authorize = async (): Promise<boolean> => {
  if (await isConnected()) return true;

  const response = await post<PocketAuthorize>({
    url: 'https://getpocket.com/v3/oauth/authorize',
    headers,
    params: { consumer_key: getPocketKey(), code: await getPocketCode() },
  });

  if (!response.ok || !response.result.access_token || !response.result.username) {
    return false;
  }
  const {
    result: { access_token: token, username },
  } = response;
  await setPocketToken(token);
  await setPocketUsername(username);
  return true;
};
