import { FC } from 'react';

interface IProps {
  className: string;
  onClick?: () => Promise<void> | void;
  icon: FC<{ className?: string }>;
  title?: string;
}

export const Icon: FC<IProps> = ({ className, onClick, icon: BaseIcon, title }) => (
  <div className="flex items-center justify-center" onClick={onClick} title={title}>
    <BaseIcon className={className} />
  </div>
);