import { getFromLocalStorage, setToLocalStorage } from 'helpers/localstorage';
import { type JsonArrayCache } from 'utils/dataCache';
import { refreshBadge } from 'utils/refreshBadge';
import { type Service } from 'utils/services';
import { type ListItem } from 'utils/typings';

interface OptimisticDelete {
  service: Service;
  id: string;
}

export const deleteItem = async ({ service, id }: OptimisticDelete) => {
  if (!service.isUpdatable) {
    throw Error(`cannot delete: service "${service.name}" is not updatable`);
  }
  await service.internal_deleteItem(id);
  const list = await getFromLocalStorage<JsonArrayCache<ListItem> | null>(service.getQueryKey);
  if (list) {
    const index = list.data.findIndex((item) => item.id === id);
    // optimistic update
    list.data.splice(index, 1);
    await setToLocalStorage(service.getQueryKey, list);
    await refreshBadge(false);
    return;
  }
  await refreshBadge(true);
};
