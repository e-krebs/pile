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
  await service.removeTag(id, tag);
  let list = await getFromLocalStorage<JsonArrayCache<ListItem> | null>(service.getQueryKey);
  const index = list ? list.data.findIndex((item) => item.id === id) : -1;
  const tagIndex = list && index !== -1 ? list.data[index].tags.findIndex((item) => item === tag) : -1;

  if (list && index !== -1 && tagIndex !== -1) {
    // optimistic update
    list.data[index].tags.splice(tagIndex, 1);
    await setToLocalStorage(service.getQueryKey, list);
  } else {
    list = await forceGet(service);
  }

  return getAllTags(list);
};
