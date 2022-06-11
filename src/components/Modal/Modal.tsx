import cx from 'classnames';
import { FC, HTMLAttributes, PropsWithChildren } from 'react';
import { X } from 'react-feather';

import { useModal } from './ModalContext';

interface ModalProps {
  title: string;
  contentProps: HTMLAttributes<HTMLDivElement>;
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  title,
  children,
  contentProps: { className: dialogClassName, ...contentProps },
}) => {
  const { closeModal, modalRef } = useModal();

  return (
    <dialog
      ref={modalRef}
      className="bg-transparent backdrop:bg-gray-700/80 backdrop:backdrop-blur-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <div {...contentProps} className={cx('relative grid w-64 gap-4 rounded-lg p-4', dialogClassName)}>
        <X
          className="absolute right-0 h-8 w-8 cursor-pointer rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={closeModal}
        />
        <h1 className="px-8 pt-3 pb-0 text-center text-xl font-bold capitalize">{title}</h1>
        {children}
      </div>
    </dialog>
  );
};
