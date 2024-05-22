import { get } from './get';
import type { Service } from './services';
import { ListItem } from './typings';
import { beautifyUrl } from './url';

export const getMatchingListItem = async (
  currentUrl: URL,
  services: Service[]
): Promise<ListItem | undefined> => {
  const matching = await Promise.all(
    services
      .map(async (service) => {
        const isConnected = await service.isConnected();
        if (!isConnected) return;
        const { data } = await get(service);
        return data.find((item) => {
          const url = new URL(item.url);
          return urlsAreMatching(url, currentUrl);
        });
      })
      .flat()
  );
  return matching.find((item) => item !== undefined);
};

export const currentUrlIsMatching = async (currentUrl: URL, services: Service[]): Promise<boolean> => {
  const matches = await Promise.all(
    services.map(async (service) => {
      const isConnected = await service.isConnected();
      if (!isConnected) return false;
      const { data } = await get(service);
      const matchingUrls = data
        .map((i) => new URL(i.url))
        .filter((iUrl) => urlsAreMatching(iUrl, currentUrl));
      return matchingUrls.length > 0;
    })
  );
  const isMatching = matches.reduce((a, b) => a || b);
  return isMatching;
};

export const urlsAreMatching = (url1: URL, url2: URL): boolean =>
  beautifyUrl(url1.origin) === beautifyUrl(url2.origin) &&
  beautifyUrl(url1.pathname) === beautifyUrl(url2.pathname) &&
  url1.search === url2.search;
