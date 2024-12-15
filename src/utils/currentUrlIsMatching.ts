import { get } from './get';
import { getUrl } from './getURL';
import type { Service } from './services';
import { ListItem } from './typings';
import { beautifyUrl } from './url';

export const getMatchingListItem = async (
  currentUrl: URL | string,
  services: Service[],
): Promise<ListItem | undefined> => {
  const currentURL = typeof currentUrl === 'string' ? getUrl(currentUrl) : currentUrl;
  const matching = await Promise.all(
    services
      .map(async (service) => {
        const isConnected = await service.isConnected();
        if (!isConnected) return;
        const { data } = await get(service);
        return data.find((item) => urlsAreMatching(item.url, currentURL));
      })
      .flat(),
  );
  return matching.find((item) => item !== undefined);
};

export const currentUrlIsMatching = async (
  currentUrl: URL | string,
  services: Service[],
): Promise<boolean> => {
  const currentURL = typeof currentUrl === 'string' ? getUrl(currentUrl) : currentUrl;
  const matches = await Promise.all(
    services.map(async (service) => {
      const isConnected = await service.isConnected();
      if (!isConnected) return false;
      const { data } = await get(service);
      const matchingUrls = data.filter(({ url }) => urlsAreMatching(url, currentURL));
      return matchingUrls.length > 0;
    }),
  );
  const isMatching = matches.reduce((a, b) => a || b);
  return isMatching;
};

export const urlsAreMatching = (url1: URL | string, url2: URL): boolean => {
  const URL1 = typeof url1 === 'string' ? getUrl(url1) : url1;
  return (
    beautifyUrl(URL1.origin) === beautifyUrl(url2.origin) &&
    beautifyUrl(URL1.pathname) === beautifyUrl(url2.pathname) &&
    url1.search === url2.search
  );
};
