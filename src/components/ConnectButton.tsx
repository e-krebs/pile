import { FC, useCallback, useState } from 'react';
import { Button } from '@e-krebs/react-library';

import { useService } from 'hooks';

export const ConnectButton: FC = () => {
  const service = useService();
  const { Icon } = service;
  const [loading, setLoading] = useState(false);

  const onClick = useCallback(async () => {
    setLoading(true);
    if (service.hasOAuth) {
      await service.connect();
    }
    setLoading(false);
  }, [service]);

  if (!service.hasOAuth) return null;

  return (
    <div className="flex justify-center py-10 text-lg">
      <Button
        iconStart={Icon}
        onPress={loading ? () => {} : onClick}
        className="h-auto border-none bg-transparent px-3 py-3 hover:bg-gray-200 dark:bg-transparent hover:dark:bg-gray-700"
      >
        {loading ? 'connecting' : 'connect'} to {service.name}
      </Button>
    </div>
  );
};
