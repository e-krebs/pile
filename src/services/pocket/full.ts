import { type FullService } from 'utils/services';

import { pocket } from '.';
import { Icon } from './Icon';

export const pocketFull: FullService = { ...pocket, hasOAuth: true, Icon };
