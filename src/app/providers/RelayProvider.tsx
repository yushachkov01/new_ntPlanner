import type { FC, ReactNode } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';

import { RelayEnvironment } from '@/shared/lib/relay/RelayEnvironment';

interface RelayProviderProps {
  children: ReactNode;
}

export const RelayProvider: FC<RelayProviderProps> = ({ children }) => (
  <RelayEnvironmentProvider environment={RelayEnvironment}>{children}</RelayEnvironmentProvider>
);
