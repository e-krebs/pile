import { fullServices } from 'services/full';

import { type FullService } from './services';

export const getFullServices = () => {
  return Object.values(fullServices) as FullService[];
};
