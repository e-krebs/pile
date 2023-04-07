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
          return (
            beautifyUrl(url.origin) === beautifyUrl(currentUrl.origin) &&
            beautifyUrl(url.pathname) === beautifyUrl(currentUrl.pathname) &&
            url.search === currentUrl.search
          );
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
        .filter(
          (iUrl) =>
            beautifyUrl(iUrl.origin) === beautifyUrl(currentUrl.origin) &&
            beautifyUrl(iUrl.pathname) === beautifyUrl(currentUrl.pathname) &&
            iUrl.search === currentUrl.search
        );
      return matchingUrls.length > 0;
    })
  );
  const isMatching = matches.reduce((a, b) => a || b);
  return isMatching;
};
