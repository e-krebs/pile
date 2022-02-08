import { FC, useMemo, useState } from 'react';
import { Loader, Image } from 'react-feather';
import { useQueryClient } from 'react-query';

import { getRgba } from 'utils/palette';
import { useService } from 'hooks';
import { useItemContext } from './ItemContext';
import { clearCache } from 'utils/dataCache';

type IconState = 'loading' | 'icon' | 'default';

export const MainIcon: FC = () => {
  const queryClient = useQueryClient();
  const { getQueryKey, archiveItem } = useService();
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
    <div className="shrink-0 rounded-full" style={{ backgroundColor: getRgba(rgb, 0.05) }}>
      <div
        className="h-8 w-8 cursor-pointer rounded-full border bg-inherit p-1.5"
        style={{ borderColor: getRgba(rgb, 0.6) }}
        title="archive and open"
        onClick={onArchiveAndOpen}
      >
        {iconState === 'loading' && <Loader className="h-full w-full animate-spin" />}
        {iconState === 'icon' && <img src={iconUrl} className="h-full w-full" />}
        {iconState === 'default' && <Image className="h-full w-full" />}
      </div>
    </div>
  );
};
