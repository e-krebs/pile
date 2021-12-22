import { createContext, useContext } from 'react';

interface Tags {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const TagsContext = createContext<Tags | null>(null);

export const useTagsContext = () => {
  const context = useContext(TagsContext);

  if (!context) {
    throw new Error('useTagsContext called outside of context provider');
  }

  return context;
};
