import type { QueryClient } from 'react-query';

export interface JsonArrayCache<T> {
  timestamp: number;
  data: T[];
}

export interface JsonCache<T> {
  timestamp: number;
  data: T;
}

export const getTimestamp = (): number => new Date().getTime();

export const isCacheExpired = <T>(cache: JsonCache<T> | JsonArrayCache<T>, duration: number): boolean =>
  getTimestamp() - cache.timestamp > duration * 5 * 60 * 1000;

export const clearCache = async (key: string, queryClient: QueryClient) => {
  await queryClient.invalidateQueries(key);
};
