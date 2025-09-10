import { FC, useMemo, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useAppSelector, useAppDispatch } from '../../services/hooks/hooks';
import { setCurrentOrder } from '../../services/reducers/ordersSlice';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { createSelector } from 'reselect';
import { RootState } from 'src/services/store';

const selectOrderData = createSelector(
  [
    (state: RootState) => state.orders.currentOrder,
    (state: RootState) => state.orders.orders,
    (state: RootState) => state.ingredients.items
  ],
  (currentOrder, orders, ingredients) => ({ currentOrder, orders, ingredients })
);

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const { currentOrder, orders, ingredients } = useAppSelector(selectOrderData);

  const orderData: TOrder | undefined =
    (location.state as any)?.order ||
    currentOrder ||
    orders.find((o) => o.number === Number(number));

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
    if (!orderData || !ingredients?.length) return null;

    const ingredientsInfo =
      orderData.ingredients?.reduce(
        (
          acc: Record<string, TIngredient & { count: number }>,
          item: string
        ) => {
          if (!item) return acc;
          const ingredient = ingredients.find((ing) => ing?._id === item);
          if (ingredient) {
            acc[item] = acc[item]
              ? { ...ingredient, count: acc[item].count + 1 }
              : { ...ingredient, count: 1 };
          }
          return acc;
        },
        {}
      ) || {};

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + (item.price || 0) * (item.count || 1),
      0
    );

    const status = orderData.status || 'unknown';

    return {
      ...orderData,
      ingredientsInfo,
      total,
      status
    };
  }, [orderData, ingredients]);

  if (loading || !orderInfo) {
    return <Preloader key={'order'} />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
