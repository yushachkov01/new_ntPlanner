import { useEffect, type ReactNode } from 'react';

import { userStore } from '@entities/user/model/store/UserStore.ts';

interface Props {
  /**
   * id текущего залогиненного пользователя
   */
  userId: number;
  children: ReactNode;
}

/**
 * UserProvider — подтягивает данные пользователя
 */
export const UserProvider = ({ userId, children }: Props) => {
  const load = userStore((s) => s.load);

  useEffect(() => {
    load(userId).catch(console.error);
  }, [load, userId]);

  return <>{children}</>;
};
