import cx from 'classnames';
import { FC, useMemo, useState } from 'react';
import { Loader, RefreshCw } from 'react-feather';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQuery, useQueryClient } from 'react-query';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { clearCache } from 'utils/dataCache';
import { get, queryKeys } from './api';
import { PocketItem } from './apiTyping';
import { Item } from './Item';

export const List: FC = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [itemOpen, setItemOpen] = useState<number | null>(null);
  const { data } = useQuery(queryKeys.get, get);

  const list: PocketItem[] | null = useMemo(() => data?.data ?? null, [data]);

  const formattedTimestamp: string | null = useMemo(() =>
    data?.timestamp === undefined
      ? null
      : formatDistanceToNow(data.timestamp, { addSuffix: true }),
    [data]);

  const refresh = async () => {
    setIsRefreshing(true);
    await clearCache(queryKeys.get, queryClient);
    setIsRefreshing(false);
  };

  useHotkeys('r', () => { refresh(); });

  return (
    <>
      {formattedTimestamp != null && (
        <div className="flex justify-center text-xs" title="press <r> to refresh">
          <span className="ml-auto">{isRefreshing ? '...' : formattedTimestamp}</span>
          <RefreshCw
            className={cx(
              'ml-auto mr-4 w-4 h-4 self-end cursor-pointer',
              isRefreshing && 'animate-spin'
            )}
            onClick={refresh}
          />
        </div>
      )}
      <div className="pt-2 space-y-px">
        {list === null && (
          <div className="flex items-center justify-center pb-2">
            <Loader className="animate-spin w-10 h-10" />
          </div>
        )}
        {list != null && list.map((item, index) => (
          <Item
            item={item}
            key={item.resolved_id}
            isOpen={index === itemOpen}
            setIsOpen={(value: boolean) => setItemOpen(value ? index : null)}
          />
        ))}
      </div>
    </>
  );
};
