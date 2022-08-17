import cx from 'classnames';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader, RefreshCw } from 'react-feather';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQuery, useQueryClient } from 'react-query';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import uniq from 'lodash/uniq';

import { clearCache } from 'utils/dataCache';
import { ListItem } from 'utils/typings';
import { Icon } from 'components/Icon';
import { Item } from './Item';
import { setBadge } from 'utils/badge';
import { useService } from 'hooks';
import { filterTag, get, search } from 'utils/get';
import { ListContext } from './ListContext';
import { TagFilter } from './TagFilter';
import { SearchFilter } from './SearchFilter';

export const List: FC = () => {
  const service = useService();
  const queryClient = useQueryClient();
  const [list, setList] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [tagOpen, setTagOpen] = useState<boolean>(false);
  const [itemOpen, setItemOpen] = useState<string | null>(null);
  const [addTagsItemOpen, setAddTagsItemOpen] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null | undefined>();
  const searchInput = useRef<HTMLInputElement>(null);
  const { data } = useQuery(service.getQueryKey, async () => {
    const list = await get(service);
    setBadge(service.name, list.data.length);
    return list;
  });

  const isLoading: boolean = useMemo(() => loading || isRefreshing, [isRefreshing, loading]);

  const allTags: string[] = useMemo(
    () => (data?.data ? uniq(data.data.map((item) => item.tags).flat()).sort() : []),
    [data]
  );

  const refreshList = useCallback((data?: ListItem[]) => {
    setList(data ?? []);
    if (data !== undefined) setLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    const updateList = async () => {
      if (tag !== undefined) {
        setLoading(true);
        const tagResult = await filterTag(tag, service);
        refreshList(tagResult.data);
      } else if (searchTerm !== null) {
        setLoading(true);
        const searchResult = await search(searchTerm, service);
        refreshList(searchResult.data);
      } else {
        refreshList(data?.data);
      }
    };
    updateList();
  }, [data, tag, service, searchTerm, refreshList]);

  const formattedTimestamp: string | null = useMemo(
    () =>
      data?.timestamp === undefined ? null : formatDistanceToNow(data.timestamp, { addSuffix: true }),
    [data]
  );

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await clearCache(service.getQueryKey, queryClient);
  }, [service, queryClient]);

  const openSearch = (open: boolean) => {
    if (open) {
      setTag(undefined);
      setTagOpen(false);
      setSearchOpen(true);
    } else {
      setSearchOpen(false);
    }
    setAddTagsItemOpen(null);
  };

  const openTag = (value: boolean) => {
    if (value) {
      setSearchTerm(null);
      setSearchOpen(false);
      setTagOpen(true);
    } else {
      setTagOpen(false);
    }
    setAddTagsItemOpen(null);
  };

  useHotkeys('r', () => {
    refresh();
  });

  return (
    <ListContext.Provider
      value={{
        allTags,
        tag,
        setTag,
        setItemOpen,
        searchTerm,
        setSearchTerm,
        setAddTagsItemOpen,
        isLoading,
        setIsLoading: setLoading,
      }}
    >
      {formattedTimestamp != null && (
        <div className="flex items-center justify-center text-xs">
          <SearchFilter searchOpen={searchOpen} openSearch={openSearch}>
            <span className="grow text-center" title="press <r> to Refresh">
              {isRefreshing ? '...' : formattedTimestamp}
            </span>
          </SearchFilter>
          <TagFilter tagOpen={tagOpen} openTag={openTag} />
          <Icon
            icon={RefreshCw}
            title="Refresh (or press <r>)"
            className={cx(
              'mx-2 h-4 w-4',
              isRefreshing && 'animate-spin',
              searchOpen ? 'cursor-not-allowed' : 'cursor-pointer'
            )}
            onClick={searchOpen ? () => {} : refresh}
          />
        </div>
      )}
      <div className="space-y-px pt-2">
        {isLoading && (
          <div className="flex items-center justify-center pb-2">
            <Loader className="h-10 w-10 animate-spin" />
          </div>
        )}
        {!isLoading && list.length <= 0 && (
          <div className="flex items-center justify-center py-6">
            {searchInput.current?.value
              ? `No result for "${searchInput.current.value}".`
              : 'No items in your pocket list.'}
          </div>
        )}
        {!isLoading &&
          list.length > 0 &&
          list.map((item) => (
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
