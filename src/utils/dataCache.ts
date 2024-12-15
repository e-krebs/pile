import type { QueryClient } from 'react-query';

import { deleteFromLocalStorage } from 'helpers/localstorage';

export const cacheDurationMs = 5 * 60 * 1000; // 5 minutes

export interface JsonArrayCache<T> {
  timestamp: number;
  data: T[];
}

export interface JsonCache<T> {
  timestamp: number;
  data: T;
}

export const getTimestamp = (): number => new Date().getTime();

export const isCacheExpired = <T>(
  cache: JsonCache<T> | JsonArrayCache<T>,
  duration = cacheDurationMs,
): boolean => getTimestamp() - cache.timestamp > duration;

export const clearCache = async (key: string, queryClient: QueryClient) => {
  await deleteFromLocalStorage(key);
  await queryClient.invalidateQueries(key);
};
