import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { setCookie } from '../../utils/cookie';
import { registerUserApi } from '../../utils/burger-api';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      setErrorText('Пожалуйста, заполните все поля');
      return;
    }

    setErrorText('');

    registerUserApi({ name: userName, email, password })
      .then((res) => {
        localStorage.setItem('refreshToken', res.refreshToken);
        setCookie('accessToken', res.accessToken);
        navigate('/profile');
      })
      .catch((err) => {
        setErrorText(err.message || 'Ошибка регистрации');
      });
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
