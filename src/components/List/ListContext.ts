import { createContext, useContext } from 'react';

interface List {
  getQueryKey: string;
  archiveItem: (id: string) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
}

export const ListContext = createContext<List | null>(null);

export const useListContext = () => {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error('useListContext called outside of context provider');
  }

  return context;
};
