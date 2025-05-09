import { getFromLocalStorage, setToLocalStorage } from 'helpers/localstorage';
import { type JsonArrayCache } from 'utils/dataCache';
import { forceGet } from 'utils/get';
import { getAllTags } from 'utils/getAllTags';
import { type Service } from 'utils/services';
import { type ListItem } from 'utils/typings';

interface OptimisticAddTag {
  service: Service;
  id: string;
  tag: string;
}

export const addTag = async ({ service, id, tag }: OptimisticAddTag): Promise<string[]> => {
  if (!service.isUpdatable) {
    throw Error(`cannot add tag: service "${service.name}" is not updatable`);
  }
  await service.internal_addTag(id, tag);

  const list = await getFromLocalStorage<JsonArrayCache<ListItem> | null>(service.getQueryKey);
  if (list) {
    const index = list.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      // optimistic update
      list.data[index].tags.push(tag);
      await setToLocalStorage(service.getQueryKey, list);
      return getAllTags(list);
    }
  }

  return getAllTags(await forceGet(service));
};
