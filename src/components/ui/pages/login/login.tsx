import { FC, FormEvent, ChangeEvent } from 'react';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';

export type LoginUIProps = {
  email: string;
  password: string;
  errorText: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const LoginUI: FC<LoginUIProps> = ({
  email,
  password,
  errorText,
  handleSubmit,
  handleChange
}) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>Вход</h3>
      <form
        className={`pb-15 ${styles.form}`}
        name='login'
        onSubmit={handleSubmit}
      >
        <div className='pb-6'>
          <Input
            type='email'
            placeholder='E-mail'
            onChange={handleChange}
            value={email}
            name='email'
            autoComplete='email'
            error={false}
            errorText=''
            size='default'
          />
        </div>
        <div className='pb-6'>
          <PasswordInput
            onChange={handleChange}
            value={password}
            name='password'
            autoComplete='current-password'
          />
        </div>
        <div className={`pb-6 ${styles.button}`}>
          <Button type='primary' size='medium' htmlType='submit'>
            Войти
          </Button>
        </div>
        {errorText && (
          <p className={`${styles.error} text text_type_main-default pb-6`}>
            {errorText}
          </p>
        )}
      </form>
      <div className={`pb-4 ${styles.question} text text_type_main-default`}>
        Вы&nbsp;— новый пользователь?
        <Link to='/register' className={`pl-2 ${styles.link}`}>
          Зарегистрироваться
        </Link>
      </div>
      <div className={`${styles.question} text text_type_main-default pb-6`}>
        Забыли пароль?
        <Link to='/forgot-password' className={`pl-2 ${styles.link}`}>
          Восстановить пароль
        </Link>
      </div>
    </div>
  </main>
);
