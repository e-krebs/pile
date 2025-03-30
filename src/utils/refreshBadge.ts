import { getServices } from 'utils/getService';
import { getShowCountOnBadge } from 'utils/getShowCountOnBadge';
import { setBadge } from 'utils/badge';
import { forceGet, get } from 'utils/get';

export const refreshBadge = async (force: boolean) => {
  await Promise.all(
    getServices().map(async (service) => {
      const isConnected = await service.isConnected();
      if (!isConnected) return;
      const showCountOnBadge = await getShowCountOnBadge();
      if (showCountOnBadge[service.name] === false) return;
      const { data } = force ? await forceGet(service) : await get(service);
      setBadge(service.name, data.length);
    }),
  );
};
