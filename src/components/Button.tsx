import cx from 'classnames';
import { FC, useCallback, useMemo, useState } from 'react';
import { Loader } from 'react-feather';

interface IProps {
  disabled?: boolean;
  startIcon?: FC;
  onClick: () => Promise<unknown> | unknown;
}

const waitFn = (duration = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};

export const Button: FC<IProps> = ({
  disabled = false,
  startIcon: StartIcon,
  onClick,
  children
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const Icon = useMemo(() => {
    if (!StartIcon) return;
    return loading ? Loader : StartIcon;
  }, [StartIcon, loading]);

  const innerDisabled = useMemo(() => disabled || loading, [disabled, loading]);

  const action = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled([waitFn(), onClick()]);
    setLoading(false);
  }, [onClick]);

  return (
    <div
      onClick={innerDisabled ? () => { } : action}
      className={cx(
        'flex space-x-2 p-2 rounded-md border border-gray-200 dark:border-gray-700',
        innerDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
        innerDisabled ? 'bg-stripe-disabled' : 'hover:bg-gray-200 hover:dark:bg-gray-700',
        !innerDisabled && 'hover:border-gray-500 dark:hover:border-gray-400',
      )}
    >
      {Icon && <Icon className={cx(loading && 'animate-spin')} />}
      <div>{children}</div>
      <div>{loading}</div>
    </div>
  );
};
