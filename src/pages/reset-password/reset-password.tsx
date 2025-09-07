import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '../../utils/burger-api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    resetPasswordApi({ password, token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login', { replace: true });
      })
      .catch((err) => setError(err));
  };

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setToken={setToken}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
