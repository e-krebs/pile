import cx from 'classnames';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader, RefreshCw, Search } from 'react-feather';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQuery, useQueryClient } from 'react-query';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import uniq from 'lodash/uniq';

import { clearCache } from 'utils/dataCache';
import { ListItem } from 'utils/typings';
import { Icon } from 'components/Icon';
import { SearchInput } from 'components/SearchInput';
import { Item } from './Item';
import { setBadge } from 'utils/badge';
import { useService } from 'hooks';
import { get, search } from 'utils/get';
import { ListContext } from './ListContext';

export const List: FC = () => {
  const service = useService();
  const queryClient = useQueryClient();
  const [list, setList] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [itemOpen, setItemOpen] = useState<string | null>(null);
  const [addTagsItemOpen, setAddTagsItemOpen] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const { data } = useQuery(
    service.getQueryKey,
    async () => {
      const list = await get(service);
      setBadge(service.name, list.data.length);
      return list;
    }
  );

  const allTags: string[] = useMemo(
    () => data?.data
      ? uniq(data.data.map(item => item.tags).flat()).sort()
      : [],
    [data]
  );

  useEffect(() => {
    const updateList = async () => {
      if (searchTerm != null) {
        setIsLoading(true);
        const searchResult = await search(searchTerm, service);
        setList(searchResult.data);
        setIsLoading(false);
      } else if (data?.data !== undefined) {
        setList(data.data);
        setIsLoading(false);
      }
    };
    updateList();
  // removing searchTerm from the list 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, service]);

  const formattedTimestamp: string | null = useMemo(() =>
    data?.timestamp === undefined
      ? null
      : formatDistanceToNow(data.timestamp, { addSuffix: true }),
    [data]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await clearCache(service.getQueryKey, queryClient);
    setIsRefreshing(false);
  }, [service, queryClient]);

  const onSearch = async (value?: string) => {
    if (!value) {
      setSearchTerm(null);
      setList(data?.data ?? []);
    } else {
      setIsLoading(true);
      setSearchTerm(value);
      const searchResult = await search(value, service);
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
    (e) => { e.preventDefault(); setSearchOpen(false); onSearch(); },
    { enableOnTags: ['INPUT'] }
  );

  return (
    <ListContext.Provider value={{ allTags, setItemOpen, setAddTagsItemOpen }}>
      {formattedTimestamp != null && (
        <div className="flex items-center justify-center text-xs">
          <Icon
            icon={Search}
            title={searchOpen ? 'Close search (or press <esc>)' : 'Open search (or press <s>)'}
            className="ml-2 p-1 w-8 h-8 cursor-pointer"
            onClick={() => setSearchOpen(!searchOpen)}
          />
          {searchOpen && <SearchInput onSearch={onSearch} className="grow" />}
          {!searchOpen && (
            <span className="grow text-center" title="press <r> to Refresh">
              {isRefreshing ? '...' : formattedTimestamp}
            </span>
          )}
          <Icon
            icon={RefreshCw}
            title="Refresh (or press <r>)"
            className={cx(
              'mr-2 w-4 h-4',
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
        {!isLoading && list.length > 0 && list.map((item) => (
          <Item
            item={item}
            key={item.id}
            isOpen={item.id === itemOpen}
            isAddTagsOpen={item.id === addTagsItemOpen}
          />
        ))}
      </div>
    </ListContext.Provider>
  );
};
