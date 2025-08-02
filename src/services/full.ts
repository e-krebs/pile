import { type FullService } from 'utils/services';

import { algoliaFull } from './algolia/full';
import { ServiceNames } from './types';

export const fullServices: Record<ServiceNames, FullService> = {
  algolia: algoliaFull,
};
