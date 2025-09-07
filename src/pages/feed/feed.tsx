import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { fetchFeeds } from '../../services/reducers/ordersSlice';
import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }
  if (error) {
    return <p style={{ color: 'red' }}>Ошибка: {error}</p>;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
