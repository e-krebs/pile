import cx from 'classnames';
import { FC, useRef } from 'react';
import { AriaTextFieldOptions, useTextField } from '@react-aria/textfield';

export interface TextInputProps extends AriaTextFieldOptions<'input'> {
  className?: string;
}

export const TextInput: FC<TextInputProps> = (props) => {
  const { label, className } = props;
  const ref = useRef(null);
  const {
    labelProps,
    inputProps: { className: inputClassName, ...inputProps },
    descriptionProps,
    errorMessageProps: { className: errorClassName, ...errorMessageProps }
  } = useTextField(props, ref);

  return (
    <div className="flex flex-col">
      {label && <label {...labelProps}>{label}</label>}
      <input
        {...inputProps}
        ref={ref}
        className={cx(inputClassName, className, 'outline-none')}
      />
      {props.description && (
        <div {...descriptionProps}>
          {props.description}
        </div>
      )}
      {props.errorMessage && (
        <div {...errorMessageProps} className={cx(errorClassName, 'text-red-600')}>
          {props.errorMessage}
        </div>
      )}
    </div>
  );
};
