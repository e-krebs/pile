import { type FC } from 'react';

import { FullService } from 'utils/services';

export type ServiceTabProps = {
  service: FullService;
  rounded?: 'full' | 't-md';
};

export type NoServiceTabProps = {
  borderClassName?: string;
  Icon: FC;
  rounded?: 'full' | 't-md';
};

export type SharedTabProps = ServiceTabProps | NoServiceTabProps;
