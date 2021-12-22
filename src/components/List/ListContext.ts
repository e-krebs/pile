import { createContext, useContext } from 'react';

interface List {
  allTags: string[];
  tag?: string | null;
  setTag: (tag?: string | null) => void;
  searchTerm: string | null;
  setSearchTerm: (string: string | null) => void;
  setItemOpen: (id: string | null) => void;
  setAddTagsItemOpen: (id: string | null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const ListContext = createContext<List | null>(null);

export const useListContext = () => {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error('useListContext called outside of context provider');
  }

  return context;
};
