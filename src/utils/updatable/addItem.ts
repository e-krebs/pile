import { getFromLocalStorage, setToLocalStorage } from 'helpers/localstorage';
import { type JsonArrayCache } from 'utils/dataCache';
import { refreshBadge } from 'utils/refreshBadge';
import { type Service } from 'utils/services';
import { type ListItem } from 'utils/typings';

interface OptimisticAdd {
  service: Service;
  url: string;
  tags?: string[];
}

export const addItem = async ({ service, url, tags }: OptimisticAdd) => {
  if (!service.isUpdatable) {
    throw Error(`cannot add: service "${service.name}" is not updatable`);
  }
  const item = await service.add(url, tags);
  const list = await getFromLocalStorage<JsonArrayCache<ListItem> | null>(service.getQueryKey);
  if (list) {
    // optimistic update
    list.data.unshift(item);
    await setToLocalStorage(service.getQueryKey, list);
    await refreshBadge(false);
  } else {
    await refreshBadge(true);
  }
};
