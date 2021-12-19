import { createContext, useContext } from 'react';

import type { RGB } from 'utils/palette';

interface Item {
  id: string;
  url: string;
  title: string;
  iconUrl?: string;
  rgb: RGB;
  tags: string[];
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const ItemContext = createContext<Item | null>(null);

export const useItemContext = () => {
  const context = useContext(ItemContext);

  if (!context) {
    throw new Error('useItemContext called outside of context provider');
  }

  return context;
};
