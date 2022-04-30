import { get } from './get';
import { Service } from './services';

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
            iUrl.origin === currentUrl.origin &&
            iUrl.pathname === currentUrl.pathname &&
            iUrl.search === currentUrl.search
        );
      return matchingUrls.length > 0;
    })
  );
  const isMatching = matches.reduce((a, b) => a || b);
  return isMatching;
};
