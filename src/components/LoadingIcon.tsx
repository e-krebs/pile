import { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { type IconProps, Loader } from 'react-feather';
import { Button } from '@e-krebs/react-library';

interface IProps {
  disabled?: boolean;
  startIcon?: FC;
  onClick: () => Promise<unknown> | unknown;
  options?: {
    disableLoader?: boolean;
  };
}

const waitFn = (duration = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};

const LoadingIcon: FC<IconProps> = (props) => <Loader {...props} className="animate-spin" />;

export const LoaderButton: FC<PropsWithChildren<IProps>> = ({
  disabled = false,
  startIcon: StartIcon,
  onClick,
  options,
  children,
}) => {
  const disableLoader = options?.disableLoader ?? false;
  const [loading, setLoading] = useState<boolean>(false);
  const Icon = useMemo(() => {
    if (!StartIcon) return;
    return loading ? LoadingIcon : StartIcon;
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
    <Button onPress={innerDisabled ? () => {} : action} iconStart={Icon} isDisabled={innerDisabled}>
      {children}
    </Button>
  );
};
