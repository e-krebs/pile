import uniq from 'lodash/uniq';

import { JsonArrayCache } from './dataCache';
import { ListItem } from './typings';

export const getAllTags = (cachedData?: JsonArrayCache<ListItem>): string[] =>
  cachedData?.data ? uniq(cachedData.data.map((item) => item.tags).flat()).sort() : [];
