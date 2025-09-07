import { ProfileMenuUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../services/hooks/hooks';
import { clearUser } from '../../services/reducers/userSlice';
import { deleteCookie } from '../../utils/cookie';

export const ProfileMenu = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(clearUser());
    navigate('/login', { replace: true });
  };

  return (
    <ProfileMenuUI pathname={location.pathname} handleLogout={handleLogout} />
  );
};
