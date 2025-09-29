import { FC } from 'react';
import { ProfileMenuUI } from '@ui';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../services/hooks/hooks';
import { clearUser } from '../../services/reducers/userSlice';
import { deleteCookie } from '../../utils/cookie';
import { logoutApi } from '../../utils/burger-api';

export const ProfileMenu: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const handleSignOut = async () => {
    try {
      const response = await logoutApi();
      if (response.success) {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch(clearUser());
        navigate('/login', { replace: true });
      } else {
        throw new Error('Logout failed');
      }
    } catch (err) {
      console.error('Ошибка при выходе из аккаунта:', err);
    }
  };

  return <ProfileMenuUI pathname={pathname} handleLogout={handleSignOut} />;
};
