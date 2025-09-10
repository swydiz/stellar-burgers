import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';

const isAuthenticated = (): boolean => !!getCookie('accessToken');

export const NonAuthRoute = () => {
  const location = useLocation();

  if (isAuthenticated()) {
    return <Navigate to='/profile' replace state={{ from: location }} />;
  }

  return <Outlet />;
};
