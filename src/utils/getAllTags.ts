import { unique } from 'radash';

import { JsonArrayCache } from './dataCache';
import { ListItem } from './typings';

export const getAllTags = (cachedData?: JsonArrayCache<ListItem>): string[] =>
  cachedData?.data ? unique(cachedData.data.map((item) => item.tags).flat()).sort() : [];
