import cx from 'classnames';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader, RefreshCw, Search } from 'react-feather';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQuery, useQueryClient } from 'react-query';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { clearCache, JsonArrayCache } from 'utils/dataCache';
import { ListItem } from 'utils/typings';
import { Icon } from 'components/Icon';
import { SearchInput } from 'components/SearchInput';
import { Item } from './Item';
import { ListContext } from './ListContext';

export interface ListProps<T = unknown> {
  getQueryKey: string;
  get: () => Promise<JsonArrayCache<T>>;
  search: (search: string) => Promise<JsonArrayCache<T>>;
  itemToListItem: (item: T) => ListItem;
  archiveItem: (id: string) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
}

export const List: FC<ListProps> = <T,>(
  { getQueryKey, get, search, itemToListItem, archiveItem, deleteItem }: ListProps<T>
) => {
  const queryClient = useQueryClient();
  const [list, setList] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [itemOpen, setItemOpen] = useState<string | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const { data } = useQuery(getQueryKey, get);

  const initialList = useMemo(() => data?.data ?? [], [data]);
  useEffect(() => {
    setList(initialList);
    setIsLoading(false);
  }, [initialList]);

  const formattedTimestamp: string | null = useMemo(() =>
    data?.timestamp === undefined
      ? null
      : formatDistanceToNow(data.timestamp, { addSuffix: true }),
    [data]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await clearCache(getQueryKey, queryClient);
    setIsRefreshing(false);
  }, [getQueryKey, queryClient]);

  const onSearch = async (value?: string) => {
    if (!value) {
      setList(initialList);
    } else {
      setIsLoading(true);
      const searchResult = await search(value);
      setList(searchResult.data);
      setIsLoading(false);
    }
  };

  useHotkeys('r', () => { refresh(); });
  useHotkeys(
    's',
    (e) => { e.preventDefault(); setSearchOpen(true); }
  );
  useHotkeys(
    'Escape',
    () => { setSearchOpen(false); onSearch(); },
    { enableOnTags: ['INPUT'] }
  );

  return (
    <ListContext.Provider value={{ getQueryKey, archiveItem, deleteItem }}>
      {formattedTimestamp != null && (
        <div className="flex items-center justify-center text-xs">
          <Icon
            icon={Search}
            title={searchOpen ? 'Close search (or press <esc>)' : 'Open search (or press <s>)'}
            className="ml-2 p-1 w-8 h-8 cursor-pointer"
            onClick={() => setSearchOpen(!searchOpen)}
          />
          {searchOpen && <SearchInput onSearch={onSearch} className="flex-grow" />}
          {!searchOpen && (
            <span className="flex-grow text-center" title="press <r> to Refresh">
              {isRefreshing ? '...' : formattedTimestamp}
            </span>
          )}
          <Icon
            icon={RefreshCw}
            title="Refresh (or press <r>)"
            className={cx(
              'mr-4 w-4 h-4',
              isRefreshing && 'animate-spin',
              searchOpen ? 'cursor-not-allowed' : 'cursor-pointer'
            )}
            onClick={searchOpen ? () => { } : refresh}
          />
        </div>
      )}
      <div className="pt-2 space-y-px">
        {isLoading && (
          <div className="flex items-center justify-center pb-2">
            <Loader className="animate-spin w-10 h-10" />
          </div>
        )}
        {!isLoading && list.length <= 0 && (
          <div className="flex justify-center items-center py-6">
            {searchInput.current?.value
              ? `No result for "${searchInput.current.value}".`
              : 'No items in your pocket list.'
            }
          </div>
        )}
        {!isLoading && list.length > 0 && list.map((pocketItem) => {
          const item = itemToListItem(pocketItem);
          return (
            <Item
              item={item}
              key={item.id}
              isOpen={item.id === itemOpen}
              setIsOpen={(value: boolean) => setItemOpen(value ? item.id : null)}
            />
          );
        })}
      </div>
    </ListContext.Provider>
  );
};
