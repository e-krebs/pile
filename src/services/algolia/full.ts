import { type FullService } from 'utils/services';

import { algolia } from '.';
import { Icon } from './Icon';
import { Setup } from './Setup';

export const algoliaFull: FullService = { ...algolia, hasOAuth: false, Icon, Setup };
