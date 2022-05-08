import { createContext, useContext } from 'react';

interface ModalContext {
  closing: boolean;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContext | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal called outside of context provider');
  }

  return context;
};
