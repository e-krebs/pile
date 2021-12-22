import { createContext, useContext } from 'react';

interface List {
  allTags: string[];
  setItemOpen: (id: string | null) => void;
  setAddTagsItemOpen: (id: string | null) => void;
}

export const ListContext = createContext<List | null>(null);

export const useListContext = () => {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error('useListContext called outside of context provider');
  }

  return context;
};
