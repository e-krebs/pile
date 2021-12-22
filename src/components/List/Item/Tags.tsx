import cx from 'classnames';
import { FC, useMemo, useState } from 'react';
import { Loader, Plus, Tag, X, XCircle } from 'react-feather';
import { useQueryClient } from 'react-query';

import { useService } from 'hooks';
import { getRgba } from 'utils/palette';
import { clearCache } from 'utils/dataCache';
import { useItemContext } from './ItemContext';
import { TagAutocomplete } from './TagAutocomplete';
import { TagsContext } from './TagsContext';

export const Tags: FC = () => {
  const { getQueryKey, removeTag } = useService();
  const { id, rgb, tags, isOpen, isAddTagsOpen, setIsAddTagsOpen } = useItemContext();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const color = useMemo(() => getRgba(rgb, 0.8), [rgb]);
  const borderColor = useMemo(() => getRgba(rgb, 0.6), [rgb]);
  const TagIcon = useMemo(() => isLoading ? Loader : Tag, [isLoading]);
  const Add = useMemo(() => isAddTagsOpen ? XCircle : Plus, [isAddTagsOpen]);

  const remove = async (tag: string) => {
    setIsLoading(true);
    const ok = await removeTag(id, tag);
    if (ok) {
      await clearCache(getQueryKey, queryClient);
    }
    setIsLoading(false);
  };

  return (
    <TagsContext.Provider value={{ isLoading, setIsLoading }}>
      <div
        className={cx(
          'group text-xs leading-4 rounded-lg cursor-default flex flex-col',
          isAddTagsOpen ? 'max-w-[calc(50%+1rem)]' : 'max-w-[25%]',
          'hover:max-w-[calc(50%+1rem)] transition-max-width'
        )}
        style={{ color, borderColor }}
      >
        <div
          className={cx(
            'flex items-center px-2 py-1 border rounded-lg bg-gray-100',
            isOpen ? 'border-inherit text-inherit' : 'border-gray-400 text-gray-500'
          )}
        >
          <TagIcon
            className={cx('w-3 h-3 mt-[3px] mb-[2px] shrink-0', isLoading && 'animate-spin')}
          />

          {tags.length > 0 && (
            <div className="flex truncate mt-[-1px]">
              {tags.map(tag => (
                <div
                  key={tag}
                  className={cx(
                    'ml-1 pl-px flex items-center group',
                    'border-b border-transparent',
                    !isLoading && 'cursor-pointer border-dashed hover:border-inherit',
                  )}
                  title={`remove tag [${tag}]`}
                  onClick={() => isLoading ? {} : remove(tag)}
                >
                  <span>{tag}</span>
                  <X className={cx(
                    'group-hover:w-3 transition-width h-3 mb-[-3px]',
                    isAddTagsOpen ? 'w-3' : 'w-0',
                  )} />
                </div>
              ))}
            </div>
          )}

          <div
            className={cx('shrink-0 grow flex justify-end', !isLoading && 'cursor-pointer')}
            title={isAddTagsOpen ? 'close' : 'add tags'}
            onClick={() => isLoading ? {} : setIsAddTagsOpen(!isAddTagsOpen)}
          >
            <Add className={cx(
              isAddTagsOpen ? 'w-3' : 'w-0',
              'group-hover:w-3 transition-width h-3 mb-[-1px] group-hover:ml-1'
            )} />
          </div>
        </div>

        {isAddTagsOpen && <TagAutocomplete />}
      </div >
    </TagsContext.Provider>
  );
};
