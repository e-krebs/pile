import cx from 'classnames';
import { EventHandler, KeyboardEvent, FC, useState, useMemo } from 'react';

import { TextInput, TextInputProps } from 'library/TextInput';

export interface Option {
  label?: string;
  value: string;
}

type AutocompleteProps = TextInputProps & {
  options: Option[];
  className?: string;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  close: () => void;
} & ({
  addValue: (value: string) => Promise<void>;
  addValueSync?: (value: string) => void;
} | {
  addValue?: (value: string) => Promise<void>;
  addValueSync: (value: string) => void;
})

export const Autocomplete: FC<AutocompleteProps> = ({
  options: allOptions,
  className,
  isLoading,
  setIsLoading,
  close,
  addValue,
  addValueSync,
  ...textInputProps
}) => {
  const [inputOption, onChange] = useState('');
  const [optionIndex, setOptionIndex] = useState<number | null>(null);

  const options: Option[] = useMemo(
    () => allOptions
      .filter(option => !inputOption || option.value.includes(inputOption))
      .slice(0, 4),
    [allOptions, inputOption]
  );

  const newOption: Option = useMemo(
    () => optionIndex === null ? { value: inputOption } : options[optionIndex],
    [options, inputOption, optionIndex]
  );

  const add = async (option?: string) => {
    if (!option && !newOption) return;
    setIsLoading(true);
    if (addValueSync) {
      addValueSync(option ?? newOption.value);
    }
    if (addValue) {
      await addValue(option ?? newOption.value);
    }
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
      case 'Backspace':
        onChange(newOption.label ?? newOption.value);
        newSelectedIndex = null;
        break;
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
        'min-w-[25%] grid gap-y-px items-center border rounded-lg bg-gray-100 dark:bg-gray-800 p-1',
      )}
    >
      <TextInput
        {...textInputProps}
        className='leading-5 px-1 rounded-sm w-full dark:bg-gray-900'
        isDisabled={isLoading}
        onChange={onChange}
        onKeyDown={keyHandler}
        autoComplete="off"
        value={newOption.label ?? newOption.value}
      />
      {options.map((option, index) => (
        <li
          key={option.value}
          className={cx(
            'leading-5 px-1 rounded-sm truncate cursor-pointer',
            'hover:bg-white hover:dark:bg-gray-900 ',
            index === optionIndex && 'bg-white dark:bg-gray-900'
          )}
          onClick={() => add(option.value)}
        >
          {option.label ?? option.value}
        </li>
      ))}
    </ul>
  );
};
