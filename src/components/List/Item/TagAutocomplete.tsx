import { FC, useCallback, useMemo } from 'react';
import { useQueryClient } from 'react-query';

import { clearCache } from 'utils/dataCache';
import { addTag } from 'utils/updatable';
import { useService } from 'hooks';
import { Autocomplete, Option } from 'components/Autocomplete';
import { useListContext } from 'components/List/ListContext';
import { useTagsContext } from 'hooks/TagsContext';

import { useItemContext } from './ItemContext';

export const TagAutocomplete: FC = () => {
  const service = useService();
  const { allTags } = useListContext();
  const { id, isOpen, setIsAddTagsOpen, tags } = useItemContext();
  const { isLoading, setIsLoading } = useTagsContext();
  const queryClient = useQueryClient();

  const options: Option[] = useMemo(
    () => allTags.filter((tag) => !tags.includes(tag)).map((value) => ({ value })),
    [allTags, tags],
  );

  const close = useCallback(() => {
    setIsAddTagsOpen(false);
  }, [setIsAddTagsOpen]);

  const addValue = useCallback(
    async (value: string) => {
      if (service.isUpdatable) {
        await addTag({ service, id, tag: value });
        await clearCache(service.getQueryKey, queryClient);
      }
      close();
    },
    [close, id, queryClient, service],
  );

  if (!service.isUpdatable) return null;

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
