import cx from 'classnames';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader, RefreshCw, Search } from 'react-feather';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQuery, useQueryClient } from 'react-query';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { clearCache } from 'utils/dataCache';
import { ListItem } from 'utils/typings';
import { Icon } from 'components/Icon';
import { SearchInput } from 'components/SearchInput';
import { Item } from './Item';
import { setBadge } from 'utils/badge';
import { useService } from 'hooks';
import { get, search } from 'utils/get';

export const List: FC = () => {
  const service = useService();
  const queryClient = useQueryClient();
  const [list, setList] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [itemOpen, setItemOpen] = useState<string | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const { data } = useQuery(
    service.getQueryKey,
    async () => {
      const list = await get(service);
      setBadge(service.name, list.data.length);
      return list;
    }
  );

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
    await clearCache(service.getQueryKey, queryClient);
    setIsRefreshing(false);
  }, [service, queryClient]);

  const onSearch = async (value?: string) => {
    if (!value) {
      setList(initialList);
    } else {
      setIsLoading(true);
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
    () => { setSearchOpen(false); onSearch(); },
    { enableOnTags: ['INPUT'] }
  );

  return (
    <>
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
        {!isLoading && list.length > 0 && list.map((item) => (
          <Item
            item={item}
            key={item.id}
            isOpen={item.id === itemOpen}
            setIsOpen={(value: boolean) => setItemOpen(value ? item.id : null)}
          />
        ))}
      </div>
    </>
  );
};
