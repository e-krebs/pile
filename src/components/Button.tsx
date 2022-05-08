import cx from 'classnames';
import { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { Loader } from 'react-feather';

interface IProps {
  disabled?: boolean;
  startIcon?: FC;
  className?: string;
  onClick: () => Promise<unknown> | unknown;
  options?: {
    disableLoader?: boolean;
  };
}

const waitFn = (duration = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};

export const Button: FC<PropsWithChildren<IProps>> = ({
  disabled = false,
  startIcon: StartIcon,
  className,
  onClick,
  options,
  children,
}) => {
  const disableLoader = options?.disableLoader ?? false;
  const [loading, setLoading] = useState<boolean>(false);
  const Icon = useMemo(() => {
    if (!StartIcon) return;
    return loading ? Loader : StartIcon;
  }, [StartIcon, loading]);

  const innerDisabled = useMemo(() => disabled || loading, [disabled, loading]);

  const action = useCallback(async () => {
    if (!disableLoader) {
      setLoading(true);
    }
    await Promise.allSettled([waitFn(), onClick()]);
    setLoading(false);
  }, [disableLoader, onClick]);

  return (
    <div
      onClick={innerDisabled ? () => {} : action}
      className={cx(
        'flex space-x-2 rounded-md border border-gray-200 p-2 dark:border-gray-700',
        innerDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
        innerDisabled ? 'bg-stripe-disabled' : 'hover:bg-gray-200 hover:dark:bg-gray-700',
        !innerDisabled && 'hover:border-gray-500 dark:hover:border-gray-400',
        className
      )}
    >
      {Icon && <Icon className={cx('m-1 h-4 w-4', loading && 'animate-spin')} />}
      <div>{children}</div>
      <div>{loading}</div>
    </div>
  );
};
