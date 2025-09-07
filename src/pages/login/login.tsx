import { FC, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { loginUserApi } from '../../utils/burger-api';
import { setCookie } from '../../utils/cookie';
import { getUser } from '../../services/reducers/userSlice';
import { useAppDispatch } from '../../services/hooks/hooks';
import { useForm } from '../../services/hooks/hooks';

export const Login: FC = () => {
  const { values, handleChange, setValues } = useForm({
    email: '',
    password: '',
    errorText: ''
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const from = (location.state?.from?.pathname as string) || '/';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await loginUserApi({
        email: values.email,
        password: values.password
      });

      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);

      await dispatch(getUser());
      navigate(from, { replace: true });
    } catch (err: any) {
      setValues((prev) => ({
        ...prev,
        errorText: err.message || 'Ошибка входа'
      }));
    }
  };

  return (
    <LoginUI
      email={values.email}
      password={values.password}
      errorText={values.errorText}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
