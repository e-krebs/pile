import cx from 'classnames';
import { FC, useMemo, useState } from 'react';
import { Loader, Plus, Tag, X, XCircle } from 'react-feather';
import { useQueryClient } from 'react-query';

import { useService } from 'hooks';
import { getRgba } from 'utils/palette';
import { clearCache } from 'utils/dataCache';
import { removeTag } from 'utils/updatable';
import { TagsContext } from 'hooks/TagsContext';

import { useItemContext } from './ItemContext';
import { TagAutocomplete } from './TagAutocomplete';

export const Tags: FC = () => {
  const service = useService();
  const { id, rgb, tags, isOpen, isAddTagsOpen, setIsAddTagsOpen } = useItemContext();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const color = useMemo(() => getRgba(rgb, 0.8), [rgb]);
  const borderColor = useMemo(() => getRgba(rgb, 0.6), [rgb]);
  const TagIcon = useMemo(() => (isLoading ? Loader : Tag), [isLoading]);
  const Add = useMemo(() => (isAddTagsOpen ? XCircle : Plus), [isAddTagsOpen]);

  const remove = async (tag: string) => {
    if (!service.isUpdatable) return;
    setIsLoading(true);
    await removeTag({ service, id, tag });
    await clearCache(service.getQueryKey, queryClient);
    setIsLoading(false);
  };

  return (
    <TagsContext.Provider value={{ isLoading, setIsLoading }}>
      <div
        className={cx(
          'group flex cursor-default flex-col rounded-lg text-xs leading-4',
          isAddTagsOpen ? 'max-w-[calc(50%+1rem)]' : 'max-w-[25%]',
          'transition-[max-width] hover:max-w-[calc(50%+1rem)]',
          !color && 'text-gray-900 dark:text-gray-100',
          !borderColor && 'border-gray-900 dark:border-gray-100',
        )}
        style={{ color, borderColor }}
      >
        <div
          className={cx(
            'flex items-center rounded-lg border bg-gray-100 px-2 py-1 hover:border-inherit hover:text-inherit dark:bg-gray-800',
            isOpen ? 'border-inherit text-inherit' : 'border-gray-400 text-gray-500 dark:text-gray-400',
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
                    !isLoading && 'border-dashed hover:border-inherit',
                    !isLoading && service.isUpdatable && 'cursor-pointer',
                  )}
                  title={service.isUpdatable ? `remove tag [${tag}]` : tag}
                  onClick={() => (isLoading || !service.isUpdatable ? {} : remove(tag))}
                >
                  <span>{tag}</span>
                  <X
                    className={cx(
                      'mb-[-3px] h-3',
                      service.isUpdatable && 'transition-[width] group-hover:w-3',
                      isAddTagsOpen ? 'w-3' : 'w-0',
                    )}
                  />
                </div>
              ))}
            </div>
          )}

          {service.isUpdatable && (
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
          )}
        </div>

        {isAddTagsOpen && <TagAutocomplete />}
      </div>
    </TagsContext.Provider>
  );
};
