import { FC, useMemo, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useAppSelector, useAppDispatch } from '../../services/hooks/hooks';
import { setCurrentOrder } from '../../services/reducers/ordersSlice';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const currentOrderFromStore = useAppSelector(
    (state) => state.orders.currentOrder
  );
  const ordersList = useAppSelector((state) => state.orders.orders);
  const ingredients = useAppSelector((state) => state.ingredients.items);

  const orderData: TOrder | undefined =
    (location.state as any)?.order ||
    currentOrderFromStore ||
    ordersList.find((o) => o.number === Number(number));

  useEffect(() => {
    if (!orderData && number) {
      setLoading(true);
      getOrderByNumberApi(Number(number))
        .then((res) => {
          if (res.success && res.orders.length > 0) {
            dispatch(setCurrentOrder(res.orders[0]));
          } else {
            dispatch(setCurrentOrder(null));
          }
        })
        .catch((err) => console.error('Ошибка загрузки заказа:', err))
        .finally(() => setLoading(false));
    }
  }, [orderData, number, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: Record<string, TIngredient & { count: number }>, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading || !orderInfo) {
    return <Preloader key={'oder'} />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
