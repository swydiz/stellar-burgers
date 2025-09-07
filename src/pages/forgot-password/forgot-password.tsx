import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordApi } from '../../utils/burger-api';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    forgotPasswordApi({ email })
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate(`/reset-password`, { replace: true });
      })
      .catch(setError);
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
