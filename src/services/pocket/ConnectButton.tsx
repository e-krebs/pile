import { FC, useCallback, useState } from 'react';

import { connect } from './api';
import { Icon } from './Icon';

export const ConnectButton: FC = () => {
  const [loading, setLoading] = useState(false);

  const onClick = useCallback(async () => {
    setLoading(true);
    await connect();
    setLoading(false);
  }, []);

  return (
    <div className="flex justify-center py-10 text-lg">
      <div
        onClick={loading ? () => {} : onClick}
        className="flex items-center rounded-md justify-center p-3 cursor-pointer hover:bg-gray-200"
      >
        <Icon className="mr-2" />
        <span>{loading ? 'connecting' : 'connect'} to pocket</span>
      </div>
    </div>
  );
};
 