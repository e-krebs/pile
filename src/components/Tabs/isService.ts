import type { ServiceTabProps, SharedTabProps } from './types';

export const isService = (props: SharedTabProps): props is ServiceTabProps =>
  (props as ServiceTabProps).service !== undefined;
