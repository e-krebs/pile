import { FC, useCallback, useMemo } from 'react';
import { useQueryClient } from 'react-query';

import { clearCache } from 'utils/dataCache';
import { useService } from 'hooks';
import { Autocomplete, Option } from 'components/Autocomplete';
import { useListContext } from 'components/List/ListContext';
import { useItemContext } from './ItemContext';
import { useTagsContext } from './TagsContext';

export const TagAutocomplete: FC = () => {
  const { getQueryKey, addTag } = useService();
  const { allTags } = useListContext();
  const { id, isOpen, setIsAddTagsOpen, tags } = useItemContext();
  const { isLoading, setIsLoading } = useTagsContext();
  const queryClient = useQueryClient();

  const options: Option[] = useMemo(
    () => allTags.filter(tag => !tags.includes(tag)).map(value => ({ value })),
    [allTags, tags]
  );

  const close = useCallback(
    () => { setIsAddTagsOpen(false); },
    [setIsAddTagsOpen]
  );

  const addValue = useCallback(
    async (value: string) => {
      const ok = await addTag(id, value);
      if (ok) {
        await clearCache(getQueryKey, queryClient);
      }
      close();
    },
    [addTag, close, getQueryKey, id, queryClient]
  );

  return (
    <Autocomplete
      aria-label="new tag"
      autoFocus
      options={options}
      className={isOpen ? 'border-inherit text-inherit' : 'border-gray-400 text-gray-500'}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      close={close}
      addValue={addValue}
    />
  );
};
