import type { QueryClient } from 'react-query';

import { deleteJson } from './files';

export const cacheDurationMs = 5 * 60 * 1000;

export interface JsonCache<T> {
  timestamp: number;
  data: T[];
}

export const getTimestamp = (): number => new Date().getTime();

export const isCacheExpired = <T>(
  cache: JsonCache<T>,
  duration = cacheDurationMs
): boolean => (getTimestamp() - cache.timestamp) > duration;

export const clearCache = async (key: string, queryClient: QueryClient) => {
  await deleteJson(key);
  await queryClient.invalidateQueries(key);
};
