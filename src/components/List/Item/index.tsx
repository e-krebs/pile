import { FC, useEffect, useRef, useState } from 'react';

import { getUrl } from 'utils/getURL';
import { getIcon, IconAndPalette } from 'utils/icon';
import { ListItem } from 'utils/typings';

import { ItemContext } from './ItemContext';
import { ItemComponent } from './ItemComponent';
import { useListContext } from '../ListContext';

interface ItemProps {
  item: ListItem;
  isOpen: boolean;
  isAddTagsOpen: boolean;
  isActive: boolean;
}

export const Item: FC<ItemProps> = ({
  item: { id, title, url, logo, tags },
  isOpen,
  isAddTagsOpen,
  isActive,
}) => {
  const { setItemOpen, setAddTagsItemOpen } = useListContext();
  const [icon, setIcon] = useState<IconAndPalette>();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const effect = async () => {
      const iconAndPalette = await getIcon(getUrl(url).hostname, logo);
      setIcon(iconAndPalette);
    };
    effect();
  }, [logo, url]);

  useEffect(() => {
    if (isActive && ref?.current) {
      ref.current.scrollIntoView({ block: 'center' });
    }
  }, [ref, isActive]);

  return (
    <ItemContext.Provider
      value={{
        id,
        url,
        title,
        iconUrl: icon?.url,
        rgb: icon?.palette,
        tags,
        isOpen,
        setIsOpen: (value: boolean) => setItemOpen(value ? id : null),
        isAddTagsOpen,
        setIsAddTagsOpen: (value: boolean) => setAddTagsItemOpen(value ? id : null),
        isActive,
      }}
    >
      <ItemComponent ref={ref} />
    </ItemContext.Provider>
  );
};
