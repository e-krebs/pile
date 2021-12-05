import { createContext, useContext } from 'react';

import { Service } from 'utils/services';

export const ServiceContext = createContext<Service | null>(null);

export const useService = () => {
  const context = useContext(ServiceContext);

  if (!context) {
    throw new Error('useService called outside of context provider');
  }

  return context;
};
