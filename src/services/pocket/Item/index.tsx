import { FC, useState } from 'react';
import useAsyncEffect from 'use-async-effect';

import { getIcon, IconAndPalette } from 'utils/icon';
import { defaultRgb } from 'utils/palette';
import { isEmpty } from 'utils/string';
import { PocketItem } from 'services/pocket/apiTyping';
import { ItemContext } from './ItemContext';
import { ItemComponent } from './ItemComponent';

interface ItemProps {
  item: PocketItem;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const Item: FC<ItemProps> = ({ item, isOpen, setIsOpen }) => {
  const [icon, setIcon] = useState<IconAndPalette>();
  const title = isEmpty(item.given_title) ? item.given_title : item.resolved_title;
  const url = isEmpty(item.given_url) ? item.given_url : item.resolved_url;

  useAsyncEffect(async () => {
    const iconAndPalette = await getIcon(new URL(url).hostname, item.domain_metadata?.logo);
    setIcon(iconAndPalette);
  }, [item]);

  return (
    <ItemContext.Provider
      value={{
        itemId: item.item_id,
        url,
        title,
        iconUrl: icon?.url,
        rgb: icon?.palette.vibrant ?? defaultRgb,
        isOpen,
        setIsOpen,
      }}
    >
      <ItemComponent />
    </ItemContext.Provider>
  );
};
