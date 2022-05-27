import cx from 'classnames';
import { FC, HTMLAttributes, PropsWithChildren } from 'react';
import { X } from 'react-feather';

import { useModal } from './ModalContext';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  contentProps?: HTMLAttributes<HTMLElement>;
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  title,
  children,
  contentProps,
  className,
  ...props
}) => {
  const { closing, closeModal } = useModal();

  return (
    <div
      {...props}
      className={cx(
        'fixed top-0 left-0 z-[9999] flex h-screen w-screen items-start justify-center bg-black bg-opacity-70 pt-[33vh] text-white dark:bg-white dark:bg-opacity-70',
        className
      )}
      onClick={closeModal}
    >
      <section
        {...contentProps}
        className={cx(
          'relative grid w-64 animate-spin gap-4 rounded-lg p-4',
          closing ? 'animate-blowDownModal' : 'animate-blowUpModal'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <X
          className="absolute right-0 h-8 w-8 cursor-pointer rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={closeModal}
        />
        <h1 className="px-8 pt-3 pb-0 text-center text-xl font-bold capitalize">{title}</h1>
        {children}
      </section>
    </div>
  );
};
