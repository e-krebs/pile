import cx from 'classnames';
import { EventHandler, KeyboardEvent, FC, useState, useMemo } from 'react';

import { TextInput, TextInputProps } from 'library/TextInput';

interface IProps extends TextInputProps {
  options: string[];
  className?: string;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  close: () => void;
  addValue: (value: string) => Promise<void>;
}

export const Autocomplete: FC<IProps> = ({
  options: allOptions,
  className,
  isLoading,
  setIsLoading,
  close,
  addValue,
  ...textInputProps
}) => {
  const [inputOption, onChange] = useState('');
  const [optionIndex, setOptionIndex] = useState<number | null>(null);

  const options: string[] = useMemo(
    () => allOptions.filter(option => !inputOption || option.includes(inputOption)).slice(0, 4),
    [allOptions, inputOption]
  );

  const newOption = useMemo(
    () => optionIndex === null ? inputOption : options[optionIndex],
    [options, inputOption, optionIndex]
  );

  const add = async (option?: string) => {
    if (!option && !newOption) return;
    setIsLoading(true);
    await addValue(option ?? newOption);
    close();
    setIsLoading(false);
  };

  const keyHandler: EventHandler<KeyboardEvent> = ({ code, preventDefault }) => {
    let newSelectedIndex: number | null = optionIndex;
    switch (code) {
      case 'Escape':
        close();
        preventDefault();
        break;
      case 'ArrowDown':
        newSelectedIndex = optionIndex === null ? 0 : optionIndex + 1;
        break;
      case 'ArrowUp':
        newSelectedIndex = optionIndex === null ? options.length - 1 : optionIndex - 1;
        break;
      case 'Enter':
        add();
        return;
    }
    if (
      newSelectedIndex != null &&
      (newSelectedIndex >= options.length || newSelectedIndex < 0)
    ) {
      newSelectedIndex = null;
    }
    setOptionIndex(newSelectedIndex);
  };

  return (
    <ul
      className={cx(
        className,
        'min-w-[25%] grid gap-y-px items-center border rounded-lg bg-gray-100 p-1',
      )}
    >
      <TextInput
        {...textInputProps}
        className='leading-5 px-1 rounded-sm'
        isDisabled={isLoading}
        onChange={onChange}
        onKeyDown={keyHandler}
        autoComplete="off"
        value={newOption}
      />
      {options.map((option, index) => (
        <li
          key={option}
          className={cx(
            'leading-5 px-1 rounded-sm truncate hover:bg-white cursor-pointer',
            index === optionIndex && 'bg-white'
          )}
          onClick={() => add(option)}
        >
          {option}
        </li>
      ))}
    </ul>
  );
};
