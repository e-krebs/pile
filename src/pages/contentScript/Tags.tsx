import cx from 'classnames';
import { useCallback, useMemo, useState, type FC } from 'react';
import { Tag, X, XCircle, Plus, Loader } from 'react-feather';

import { Autocomplete, Option } from 'components/Autocomplete';
import { TagsContext } from 'hooks/TagsContext';

type TagsProps = {
  allTags: string[];
  tags: string[];
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
} & (
  | {
      addTag: (value: string) => Promise<void>;
      removeTag: (value: string) => Promise<void>;
      addTagSync?: (value: string) => void;
      removeTagSync?: (value: string) => void;
    }
  | {
      addTag?: (value: string) => Promise<void>;
      removeTag?: (value: string) => Promise<void>;
      addTagSync: (value: string) => void;
      removeTagSync: (value: string) => void;
    }
);

export const Tags: FC<TagsProps> = ({
  allTags,
  tags,
  addTag,
  addTagSync,
  removeTag,
  removeTagSync,
  isLoading,
  setIsLoading,
}) => {
  const [isAddTagsOpen, setIsAddTagsOpen] = useState(false);

  const remove = useCallback(
    async (tag: string) => {
      setIsLoading(true);
      if (removeTag) await removeTag(tag);
      if (removeTagSync) removeTagSync(tag);
      setIsAddTagsOpen(false);
      if (addTagSync) setIsLoading(false);
    },
    [addTagSync, removeTag, removeTagSync, setIsLoading],
  );

  const addValue = useCallback(
    async (tag: string) => {
      setIsLoading(true);
      await addTag?.(tag);
      setIsAddTagsOpen(false);
    },
    [addTag, setIsLoading],
  );

  const addValueSync = useCallback(
    (tag: string) => {
      if (addTagSync) addTagSync(tag);
      setIsAddTagsOpen(false);
    },
    [addTagSync],
  );

  const Add = useMemo(() => (isAddTagsOpen ? XCircle : Plus), [isAddTagsOpen]);
  const TagIcon = useMemo(() => (isLoading ? Loader : Tag), [isLoading]);

  const options: Option[] = useMemo(
    () => allTags.filter((tag) => !tags.includes(tag)).map((value) => ({ value })),
    [allTags, tags],
  );

  const autoCompleteProps = useMemo(
    () => ({
      'aria-label': 'new tag',
      autoFocus: true,
      options,
      className: 'border-gray-400 text-gray-500',
      isLoading,
      setIsLoading,
      close: () => setIsAddTagsOpen(false),
    }),
    [isLoading, options, setIsLoading],
  );

  return (
    <TagsContext.Provider value={{ isLoading, setIsLoading }}>
      {allTags.length > 0 && (
        <div
          className={cx(
            'group flex cursor-default flex-col rounded-lg text-xs leading-4',
            isAddTagsOpen ? 'max-w-[calc(100%+1rem)]' : 'max-w-full',
            'transition-[max-width] hover:max-w-[calc(100%+1rem)]',
            'text-gray-900 dark:text-gray-100',
            'border-gray-900 dark:border-gray-100',
          )}
        >
          <div
            className={cx(
              'flex items-center rounded-lg border bg-gray-100 px-2 py-1 dark:bg-gray-800',
              'border-gray-400 text-gray-500 dark:text-gray-400',
            )}
          >
            <TagIcon className={cx('mt-[3px] mb-[2px] h-3 w-3 shrink-0', isLoading && 'animate-spin')} />

            {tags.length > 0 && (
              <div className="mt-[-1px] flex truncate border-inherit">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className={cx(
                      'group ml-1 flex items-center pl-px',
                      'border-b border-transparent',
                      !isLoading && 'cursor-pointer border-dashed hover:border-inherit',
                    )}
                    title={`remove tag [${tag}]`}
                    onClick={() => (isLoading ? {} : remove(tag))}
                  >
                    <span>{tag}</span>
                    <X
                      className={cx(
                        'mb-[-3px] h-3 transition-[width] group-hover:w-3',
                        isAddTagsOpen ? 'w-3' : 'w-0',
                      )}
                    />
                  </div>
                ))}
              </div>
            )}

            <div
              className={cx('flex shrink-0 grow justify-end', !isLoading && 'cursor-pointer')}
              title={isAddTagsOpen ? 'close' : 'add tags'}
              onClick={() => (isLoading ? {} : setIsAddTagsOpen(!isAddTagsOpen))}
            >
              <Add
                className={cx(
                  isAddTagsOpen ? 'w-3' : 'w-0',
                  'mb-[-1px] h-3 transition-[width] group-hover:ml-1 group-hover:w-3',
                )}
              />
            </div>
          </div>

          {isAddTagsOpen && addTag && (
            <Autocomplete {...autoCompleteProps} addValue={addValue} stopLoadingAfterAdd={false} />
          )}
          {isAddTagsOpen && addTagSync && (
            <Autocomplete {...autoCompleteProps} addValueSync={addValueSync} />
          )}
        </div>
      )}
    </TagsContext.Provider>
  );
};
