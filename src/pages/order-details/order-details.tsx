import styles from './order-details.module.css';

import { useParams } from 'react-router-dom';
import { OrderDetailsUI } from '../../components/ui/order-details/order-details';
import { useAppDispatch } from '../../services/hooks/hooks';
import { clearConstructor } from '../../services/reducers/constructorSlice';
import { useEffect } from 'react';

export const OrderDetailsPage = () => {
  const dispatch = useAppDispatch();
  const { number } = useParams();

  const parsedNumber = number ? parseInt(number, 10) : 0;

  useEffect(() => {
    if (parsedNumber) {
      dispatch(clearConstructor());
    }
  }, [parsedNumber]);

  return (
    <main className={styles.main}>
      <OrderDetailsUI orderNumber={parsedNumber} />
    </main>
  );
};
