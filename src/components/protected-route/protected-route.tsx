import { Navigate, useLocation } from 'react-router-dom';
import { ProtectedRouteProps } from './type';
import { getCookie } from '../../utils/cookie';

const isAuthenticated = (): boolean => !!getCookie('accessToken');

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
