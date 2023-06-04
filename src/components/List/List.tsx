import cx from 'classnames';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Loader, RefreshCw, Tag } from 'react-feather';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQuery, useQueryClient } from 'react-query';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

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
import { getAllTags } from 'utils/getAllTags';
import { getLastTag, setLastTag } from 'utils/lastTag';

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
  const [tag, setTagLocal] = useState<string | null | undefined>();
  const { data } = useQuery(service.getQueryKey, async () => {
    const list = await get(service);
    setBadge(service.name, list.data.length);
    return list;
  });

  useEffect(() => {
    const getTagOnInit = async () => {
      const lastTag = await getLastTag(service.name);
      setTagLocal(lastTag);
    };
    getTagOnInit();
  }, [service.name]);

  const setTag = async (value: string | null | undefined) => {
    setTagLocal(value);
    await setLastTag(service.name, value);
  };

  const isLoading: boolean = useMemo(() => loading || isRefreshing, [isRefreshing, loading]);

  const allTags: string[] = useMemo(() => getAllTags(data), [data]);

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

  const openSearch = async (open: boolean) => {
    if (open) {
      await setTag(undefined);
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
          <TagFilter
            hasUntaggedItem={list.some((item) => item.tags.length <= 0)}
            tagOpen={tagOpen}
            openTag={openTag}
          />
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
          <div className="flex items-center justify-center space-x-2 py-6">
            {searchTerm && `No result for "${searchTerm}".`}
            {tag && (
              <>
                <span>No result for</span>
                <div className="flex items-center space-x-1 rounded-lg border border-gray-400 bg-gray-100 px-2 py-1 text-xs leading-4 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  <Tag className="mb-[2px] mt-[3px] h-3 w-3 shrink-0" />
                  <span>{tag}</span>
                </div>
              </>
            )}
            {!searchTerm && tag === null && 'No untagged item in your list.'}
            {!searchTerm && tag === undefined && `No items in your ${service.name} list.`}
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
