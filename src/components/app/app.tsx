import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { ConstructorPage } from '../../pages/constructor-page/constructor-page';
import { AppHeader } from '../app-header/app-header';
import { Login } from '../../pages/login/login';
import { Register } from '../../pages/register/register';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { ResetPassword } from '../../pages/reset-password/reset-password';
import { Profile } from '../../pages/profile/profile';
import { ProfileOrders } from '../../pages/profile-orders/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404/not-fount-404';
import { OrderInfo } from '../order-info/order-info';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useAppDispatch } from '../../services/hooks/hooks';
import { IngredientDetailPage } from '../../pages/ingredient-details/ingredient-details';
import { OrderDetailsPage } from '../../pages/order-details/order-details';
import { Feed } from '../../pages/feed/feed';

import { fetchIngredients } from '../../services/reducers/ingredientsSlice';
import { getUser } from '../../services/reducers/userSlice';
import { OrderInfoPage } from '../../pages/order-info/order-info';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const background = location.state && location.state.background;

  const closeModal = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(getUser());
  }, [dispatch]);

  return (
    <>
      <AppHeader />
      <Routes location={background || location}>
        <Route
          path='/'
          element={
            <div>
              <ConstructorPage />
            </div>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetailPage />} />
        <Route path='/order/:number' element={<OrderDetailsPage />} />
        <Route path='/profile/orders/:number' element={<OrderInfoPage />} />
        <Route
          path='/feed'
          element={
            <div>
              <Feed />
            </div>
          }
        />
        <Route path='/feed/:number' element={<OrderInfoPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <div>
                <Profile />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default App;
