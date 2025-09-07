import { FC, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppSelector } from '../../services/hooks/hooks';
import { addOrder, clearOrder } from '../../services/reducers/ordersSlice';
import { orderBurgerApi } from '../../utils/burger-api';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const bun = useAppSelector((state) => state.burgerConstructor?.bun ?? null);
  const ingredients = useAppSelector(
    (state) => state.burgerConstructor?.ingredients ?? []
  );

  const [orderRequest, setOrderRequest] = useState(false);
  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);

  const onOrderClick = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!bun || orderRequest) return;

    const ingredientIds = [bun, ...ingredients, bun].map((item) => item._id);

    try {
      setOrderRequest(true);

      const data = await orderBurgerApi(ingredientIds);
      setOrderModalData(data.order);
      dispatch(addOrder(data.order));

      navigate(`/order/${data.order.number}`);
    } catch (err) {
      console.error('Ошибка при создании заказа:', err);
    } finally {
      setOrderRequest(false);
    }
  };

  const closeOrderModal = () => {
    setOrderModalData(null);
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
