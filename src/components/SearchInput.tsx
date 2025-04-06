import cx from 'classnames';
import { FC, useRef } from 'react';
import { debounce } from 'radash';
import { XCircle } from 'react-feather';

import { Icon } from './Icon';

interface IProps {
  className?: string;
  onSearch: (value?: string) => void;
}

export const SearchInput: FC<IProps> = ({ className, onSearch }) => {
  const searchInput = useRef<HTMLInputElement>(null);

  const onChange = () => {
    onSearch(searchInput.current?.value);
  };

  const clear = () => {
    if (!searchInput.current) return;
    searchInput.current.value = '';
    onSearch();
  };

  return (
    <div
      className={cx(
        className,
        'mr-2 ml-4 flex h-8 items-center px-2 text-base leading-8',
        'rounded-md border border-gray-200',
      )}
    >
      <input
        ref={searchInput}
        type="text"
        placeholder="Search"
        className={'grow bg-transparent outline-hidden'}
        autoFocus={true}
        onChange={debounce({ delay: 300 }, onChange)}
      />
      <Icon
        icon={XCircle}
        onClick={clear}
        title="Clear search"
        className={cx('cursor-pointer py-1', !searchInput.current?.value && 'hidden')}
      />
    </div>
  );
};
