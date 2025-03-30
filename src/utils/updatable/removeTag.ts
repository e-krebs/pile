import { getFromLocalStorage, setToLocalStorage } from 'helpers/localstorage';
import { type JsonArrayCache } from 'utils/dataCache';
import { forceGet } from 'utils/get';
import { getAllTags } from 'utils/getAllTags';
import { type Service } from 'utils/services';
import { type ListItem } from 'utils/typings';

interface OptimisticRemoveTag {
  service: Service;
  id: string;
  tag: string;
}

export const removeTag = async ({ service, id, tag }: OptimisticRemoveTag): Promise<string[]> => {
  if (!service.isUpdatable) {
    throw Error(`cannot remove tag: service "${service.name}" is not updatable`);
  }
  await service.internal_removeTag(id, tag);
  const list = await getFromLocalStorage<JsonArrayCache<ListItem> | null>(service.getQueryKey);
  if (list) {
    const index = list.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      const tagIndex = list.data[index].tags.findIndex((item) => item === tag);
      if (tagIndex !== -1) {
        // optimistic update
        list.data[index].tags.splice(tagIndex, 1);
        await setToLocalStorage(service.getQueryKey, list);
        return getAllTags(list);
      }
    }
  }

  return getAllTags(await forceGet(service));
};
