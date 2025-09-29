import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { getUser, updateUser } from '../../services/reducers/userSlice';
import { ProfileUI } from '../../components/ui/pages/profile/profile';

export const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const [initialFormValue, setInitialFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [formValue, setFormValue] = useState(initialFormValue);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [updateUserError, setUpdateUserError] = useState('');

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setInitialFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...formValue, [name]: value };
    setFormValue(updatedForm);

    const hasChanges = Object.keys(updatedForm).some(
      (key) =>
        updatedForm[key as keyof typeof updatedForm] !==
        initialFormValue[key as keyof typeof initialFormValue]
    );
    setIsFormChanged(hasChanges);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateUser(formValue)).unwrap();
      setInitialFormValue(formValue);
      setIsFormChanged(false);
    } catch (err: any) {
      setUpdateUserError(err.message || 'Ошибка обновления профиля');
    }
  };

  const handleCancel = () => {
    setFormValue(initialFormValue);
    setIsFormChanged(false);
    setUpdateUserError('');
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleInputChange={handleInputChange}
    />
  );
};
