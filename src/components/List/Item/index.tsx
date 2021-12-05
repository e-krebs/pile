import { FC, useState } from 'react';
import useAsyncEffect from 'use-async-effect';

import { getIcon, IconAndPalette } from 'utils/icon';
import { defaultRgb } from 'utils/palette';
import { ListItem } from 'utils/typings';
import { ItemContext } from './ItemContext';
import { ItemComponent } from './ItemComponent';

interface ItemProps {
  item: ListItem;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const Item: FC<ItemProps> = ({
  item: { id, title, url, logo },
  isOpen,
  setIsOpen,
}) => {
  const [icon, setIcon] = useState<IconAndPalette>();

  useAsyncEffect(async () => {
    const iconAndPalette = await getIcon(new URL(url).hostname, logo);
    setIcon(iconAndPalette);
  }, [logo]);

  return (
    <ItemContext.Provider
      value={{
        id,
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
