import { FC, useEffect, useState } from 'react';

import { getIcon, IconAndPalette } from 'utils/icon';
import { defaultRgb } from 'utils/palette';
import { ListItem } from 'utils/typings';
import { ItemContext } from './ItemContext';
import { ItemComponent } from './ItemComponent';
import { useListContext } from '../ListContext';

interface ItemProps {
  item: ListItem;
  isOpen: boolean;
  isAddTagsOpen: boolean;
}

export const Item: FC<ItemProps> = ({ item: { id, title, url, logo, tags }, isOpen, isAddTagsOpen }) => {
  const { setItemOpen, setAddTagsItemOpen } = useListContext();
  const [icon, setIcon] = useState<IconAndPalette>();

  useEffect(() => {
    const effect = async () => {
      const iconAndPalette = await getIcon(new URL(url).hostname, logo);
      setIcon(iconAndPalette);
    };
    effect();
  }, [logo, url]);

  return (
    <ItemContext.Provider
      value={{
        id,
        url,
        title,
        iconUrl: icon?.url,
        rgb: icon?.palette.vibrant ?? defaultRgb,
        tags,
        isOpen,
        setIsOpen: (value: boolean) => setItemOpen(value ? id : null),
        isAddTagsOpen,
        setIsAddTagsOpen: (value: boolean) => setAddTagsItemOpen(value ? id : null),
      }}
    >
      <ItemComponent />
    </ItemContext.Provider>
  );
};
