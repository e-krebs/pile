import cx from 'classnames';
import { FC, useRef } from 'react';
import debounce from 'lodash/debounce';
import { XCircle } from 'react-feather';

import { Icon } from './Icon';

interface IProps {
  className?: string;
  onSearch: (value?: string) => Promise<void>;
}

export const SearchInput: FC<IProps> = ({ className, onSearch }) => {
  const searchInput = useRef<HTMLInputElement>(null);

  const onChange = async () => {
    await onSearch(searchInput.current?.value);
  };

  const clear = async () => {
    if (!searchInput.current) return;
    searchInput.current.value = '';
    await onSearch();
  };

  return (
    <div
      className={cx(
        className,
        'flex items-center h-8 mx-6 px-2 text-base leading-8',
        'border border-gray-200 rounded-md'
        )}
    >
      <input
        ref={searchInput}
        type="text"
        placeholder="Search"
        className={'flex-grow bg-transparent outline-none'}
        autoFocus={true}
        onChange={debounce(onChange, 300)}
      />
      <Icon
        icon={XCircle}
        onClick={clear}
        title="Clear search"
        className={cx('py-1 cursor-pointer', !searchInput.current?.value && 'hidden')}
      />
    </div>
  );
};
