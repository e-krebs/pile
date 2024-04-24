import { type Hit } from '@algolia/client-search';

import { ListItem } from 'utils/typings';

export interface AlgoliaItem {
  url: string;
  text: string;
  tags: string[];
}

export const algoliaItemToListItem = (item: Hit<AlgoliaItem>): ListItem => ({
  id: item.objectID,
  title: item.text,
  url: item.url,
  tags: item.tags,
});
