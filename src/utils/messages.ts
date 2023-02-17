import { ServiceNames } from 'services';

export type Message =
  | {
      action: 'service' | 'addToService';
      service: ServiceNames;
      url: string;
      tags?: string[];
    }
  | {
      action: 'archiveFromService' | 'deleteFromService';
      service: ServiceNames;
      id: string;
    }
  | {
      action: 'refresh';
    };
