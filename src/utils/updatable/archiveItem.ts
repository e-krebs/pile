import { getFromLocalStorage, setToLocalStorage } from 'helpers/localstorage';
import { type JsonArrayCache } from 'utils/dataCache';
import { refreshBadge } from 'utils/refreshBadge';
import { type Service } from 'utils/services';
import { type ListItem } from 'utils/typings';

interface OptimisticArchive {
  service: Service;
  id: string;
}

export const archiveItem = async ({ service, id }: OptimisticArchive) => {
  if (!service.isUpdatable) {
    throw Error(`cannot archive: service "${service.name}" is not updatable`);
  }
  await service.archiveItem(id);
  const list = await getFromLocalStorage<JsonArrayCache<ListItem> | null>(service.getQueryKey);
  const index = list ? list.data.findIndex((item) => item.id === id) : -1;
  if (list && index !== -1) {
    // optimistic update
    list.data.splice(index, 1);
    await setToLocalStorage(service.getQueryKey, list);
    await refreshBadge(false);
  } else {
    await refreshBadge(true);
  }
};
