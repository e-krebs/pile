import cx from 'classnames';
import { AriaCheckboxProps } from '@react-types/checkbox';
import { FC, useMemo, useRef } from 'react';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { useFocusRing } from '@react-aria/focus';
import { useCheckbox } from '@react-aria/checkbox';
import { useToggleState } from '@react-stately/toggle';
import { CheckSquare, Icon, Square } from 'react-feather';

export interface CheckboxProps extends AriaCheckboxProps {
  label?: string;
}

export const Checkbox: FC<CheckboxProps> = ({ label, ...props }) => {
  const state = useToggleState(props);
  const ref = useRef(null);
  const { inputProps } = useCheckbox({ ...props, 'aria-label': label }, state, ref);
  const { focusProps } = useFocusRing();

  const CheckIcon: Icon = useMemo(() => state.isSelected ? CheckSquare : Square, [state]);

  return (
    <label
      className={cx(
        'flex items-center gap-x-2',
        props.isDisabled && 'opacity-75'
      )}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} aria-label={label} ref={ref} />
      </VisuallyHidden>
      <CheckIcon />
      {label && <span>{label}</span>}
      {props.children}
    </label>
  );
};
