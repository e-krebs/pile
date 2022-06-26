import cx from 'classnames';
import {
  HTMLAttributes,
  PropsWithChildren,
  useCallback,
  forwardRef,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import { X } from 'react-feather';

interface ModalProps {
  title: string;
  contentProps: HTMLAttributes<HTMLDivElement>;
  onClosed: () => void;
}

export interface ModalRef {
  openModal: () => void;
  closeModal: () => void;
}

export const Modal = forwardRef<ModalRef, PropsWithChildren<ModalProps>>(
  ({ title, children, onClosed, contentProps: { className, ...contentProps } }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const [closing, setClosing] = useState(false);

    const closeModal = useCallback(() => {
      setClosing(true);
      setTimeout(() => {
        onClosed();
        modalRef.current?.close();
      }, 150);
    }, [modalRef, onClosed]);

    const onModalBackdropClick = useCallback(
      (event: HTMLElementEventMap['click']) => {
        if (!modalRef.current) return;
        const rect = modalRef.current.getBoundingClientRect();
        const isInDialog =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!isInDialog && (event.target as Element).tagName.toLowerCase() === 'dialog') {
          closeModal();
        }
      },
      [closeModal]
    );

    const openModal = useCallback(() => {
      setClosing(false);
      modalRef.current?.removeEventListener('click', onModalBackdropClick);
      modalRef.current?.showModal();
      modalRef.current?.addEventListener('click', onModalBackdropClick);
    }, [onModalBackdropClick]);

    useImperativeHandle(ref, () => ({ openModal, closeModal }));

    return (
      <dialog
        ref={modalRef}
        className="bg-transparent backdrop:bg-gray-700/80 backdrop:backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          {...contentProps}
          className={cx(
            'relative grid w-64 gap-4 rounded-lg p-4',
            closing ? 'animate-blowDownModal' : 'animate-blowUpModal',
            className
          )}
        >
          <X
            className="absolute right-0 h-8 w-8 cursor-pointer rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={closeModal}
          />
          <h1 className="px-8 pt-3 pb-0 text-center text-xl font-bold capitalize">{title}</h1>
          {children}
        </div>
      </dialog>
    );
  }
);
Modal.displayName = 'Modal';
