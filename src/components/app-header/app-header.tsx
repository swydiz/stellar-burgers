import { FC } from 'react';
import { AppHeaderUI } from '@ui';

import { useAppSelector } from '../../services/hooks/hooks';

export const AppHeader: FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const isAuthenticated = !!user;

  return (
    <AppHeaderUI userName={user?.name} isAuthenticated={isAuthenticated} />
  );
};
