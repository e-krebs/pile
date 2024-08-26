import { type FullService } from 'utils/services';

import { pocketFull } from './pocket/full';
import { algoliaFull } from './algolia/full';
import { ServiceNames } from './types';

export const fullServices: Record<ServiceNames, FullService> = {
  pocket: pocketFull,
  algolia: algoliaFull,
};
