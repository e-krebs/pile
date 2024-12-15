import { ListItem } from 'utils/typings';
import { GetParams } from 'utils/get';

import { getAlgoliaClient } from './helpers';
import { algoliaItemToListItem, AlgoliaItem } from './item';

const hitsPerPage = 1000;

export const get = async (param: GetParams): Promise<ListItem[]> => {
  const algolia = await getAlgoliaClient();

  if (!algolia) {
    return [];
  }

  const searchResponse = await algolia.search<AlgoliaItem>({
    query: param.type === 'search' ? param.search : '',
    hitsPerPage,
    filters: param.type === 'tag' ? (param.tag ? `tags:${param.tag}` : 'NOT tags') : undefined,
  });

  return searchResponse.hits.map(algoliaItemToListItem);
};
