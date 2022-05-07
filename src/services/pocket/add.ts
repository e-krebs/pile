import { post } from 'utils/post';
import { getPocketKey, getPocketToken } from './helpers';
import { headers } from './const';

export const add = async (url: string) => {
  const response = await post({
    url: 'https://getpocket.com/v3/add',
    headers,
    params: {
      consumer_key: getPocketKey(),
      access_token: await getPocketToken(),
      url: encodeURI(url),
    },
  });

  if (!response.ok) throw Error(`couldn't add item to pocket "${url}"`);
};
