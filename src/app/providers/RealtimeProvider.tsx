import { useEffect } from 'react';
import { useRelayEnvironment } from 'react-relay';

import { connectRealtime } from '@/shared/lib/ws/RealtimeClient';

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const env = useRelayEnvironment();

  useEffect(() => {
    const dispose = connectRealtime(env);
    return () => dispose?.();
  }, [env]);

  return <>{children}</>;
};
