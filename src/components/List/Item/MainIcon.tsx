import { FC, useMemo, useState } from 'react';
import { Loader, Image } from 'react-feather';

import { getRgba } from 'utils/palette';
import { useService } from 'hooks';
import { type Message } from 'utils/messages';

import { useItemContext } from './ItemContext';

type IconState = 'loading' | 'icon' | 'default';

export const MainIcon: FC = () => {
  const service = useService();
  const { rgb, id, url, iconUrl } = useItemContext();
  const [iconLoading, setIconLoading] = useState(false);

  const iconState: IconState = useMemo(() => {
    if (iconLoading) return 'loading';
    return iconUrl !== undefined ? 'icon' : 'default';
  }, [iconUrl, iconLoading]);

  const onArchiveAndOpen = async () => {
    if (service.isUpdatable) {
      setIconLoading(true);
      const ok = await service.archiveItem(id);
      if (ok) {
        const message: Message = { action: 'refresh' };
        chrome.runtime.sendMessage(message);
        chrome.tabs.create({ url });
      }
      setIconLoading(false);
    } else {
      chrome.tabs.create({ url });
    }
  };

  return (
    <div className="shrink-0 rounded-full" style={{ backgroundColor: getRgba(rgb, 0.05) }}>
      <div
        className="h-8 w-8 cursor-pointer rounded-full border bg-inherit p-1.5"
        style={{ borderColor: getRgba(rgb, 0.6) }}
        title={service.isUpdatable ? 'archive and open' : 'open'}
        onClick={onArchiveAndOpen}
      >
        {iconState === 'loading' && <Loader className="h-full w-full animate-spin" />}
        {iconState === 'icon' && <img src={iconUrl} className="h-full w-full" />}
        {iconState === 'default' && <Image className="h-full w-full" />}
      </div>
    </div>
  );
};
