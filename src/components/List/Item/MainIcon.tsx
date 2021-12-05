import { FC, useMemo, useState } from 'react';
import { Loader, Image } from 'react-feather';
import { useQueryClient } from 'react-query';

import { getRgba } from 'utils/palette';
import { useListContext } from 'components/List';
import { useItemContext } from './ItemContext';
import { clearCache } from 'utils/dataCache';

type IconState = 'loading' | 'icon' | 'default';

export const MainIcon: FC = () => {
  const queryClient = useQueryClient();
  const { getQueryKey, archiveItem } = useListContext();
  const { rgb, id, url, iconUrl } = useItemContext();
  const [iconLoading, setIconLoading] = useState(false);

  const iconState: IconState = useMemo(() => {
    if (iconLoading) return 'loading';
    return iconUrl !== undefined ? 'icon' : 'default';
  }, [iconUrl, iconLoading]);

  const onArchiveAndOpen = async () => {
    setIconLoading(true);
    const ok = await archiveItem(id);
    if (ok) {
      chrome.tabs.create({ url });
      await clearCache(getQueryKey, queryClient);
    }
    setIconLoading(false);
  };

  return (
    <div
      className="flex-shrink-0 rounded-full"
      style={{ backgroundColor: getRgba(rgb, 0.05) }}
    >
      <div
        className="w-8 h-8 p-1.5 rounded-full border bg-inherit cursor-pointer"
        style={{ borderColor: getRgba(rgb, 0.6) }}
        title="archive and open"
        onClick={onArchiveAndOpen}
      >
        {iconState === 'loading' && <Loader className="w-full h-full animate-spin" />}
        {iconState === 'icon' && <img src={iconUrl} className="w-full h-full" />}
        {iconState === 'default' && <Image className="w-full h-full" />}
      </div>
    </div>
  );
};
