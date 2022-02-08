import cx from 'classnames';
import { FC } from 'react';

import { Service } from 'utils/services';

type ServiceTabProps = {
  service: Service;
  rounded?: 'full' | 't-md';
};

type NoServiceTabProps = {
  borderClassName?: string;
  Icon: FC;
  rounded?: 'full' | 't-md';
};

export type SharedTabProps = ServiceTabProps | NoServiceTabProps;

type IProps = SharedTabProps & {
  active?: boolean;
  onClick: () => void;
};

export const isService = (props: SharedTabProps): props is ServiceTabProps =>
  (props as ServiceTabProps).service !== undefined;

export const Tab: FC<IProps> = ({ active = false, onClick, rounded = 't-md', ...props }) => {
  const color = isService(props)
    ? props.service.borderClassName
    : (props as NoServiceTabProps).borderClassName;
  const Icon = isService(props) ? props.service.Icon : (props as NoServiceTabProps).Icon;

  return (
    <div
      className={cx(
        'cursor-pointer p-3 hover:bg-gray-200 hover:dark:bg-gray-600',
        color,
        rounded === 't-md' && 'rounded-t-md',
        rounded === 'full' && 'rounded-full',
        active && 'border-b-2'
      )}
      onClick={onClick}
    >
      <Icon />
    </div>
  );
};
