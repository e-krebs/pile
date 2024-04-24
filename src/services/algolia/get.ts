import { getAlgoliaClient } from './helpers';
import { ListItem } from 'utils/typings';
import { GetParams } from 'utils/get';
import { algoliaItemToListItem, AlgoliaItem } from './item';

const hitsPerPage = 1000;

export const get = async (param: GetParams): Promise<ListItem[]> => {
  const algolia = await getAlgoliaClient();

  if (!algolia) {
    return [];
  }

  const searchResponse = await algolia.search<AlgoliaItem>(
    param.type === 'search' ? param.search : '',
    param.type === 'tag'
      ? { filters: param.tag ? `tags:${param.tag}` : 'NOT tags', hitsPerPage }
      : { hitsPerPage }
  );

  return searchResponse.hits.map(algoliaItemToListItem);
};
