import cx from 'classnames';
import { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { type IconProps, Loader } from 'react-feather';
import { Button } from '@e-krebs/react-library';

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

const LoadingIcon: FC<IconProps> = ({ className, ...props }) => (
  <Loader {...props} className={cx(className, 'animate-spin')} />
);

export const LoaderButton: FC<PropsWithChildren<IProps>> = ({
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
    const ActualIcon = loading ? LoadingIcon : StartIcon;
    const ResultIcon: FC<IconProps> = ({ className, ...props }) => (
      <ActualIcon {...props} className={cx(className, 'm-1')} />
    );
    return ResultIcon;
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
    <Button
      className={cx(className, 'h-auto py-2 pl-2 pr-3', innerDisabled && 'bg-stripe-disabled')}
      onPress={innerDisabled ? () => {} : action}
      iconStart={Icon}
      isDisabled={innerDisabled}
    >
      {children}
    </Button>
  );
};
