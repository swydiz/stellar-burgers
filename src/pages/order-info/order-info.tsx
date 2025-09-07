import { FC } from 'react';
import styles from './order-info.module.css';
import { OrderInfo } from '@components';

export const OrderInfoPage: FC = () => (
  <div className={styles.containerMain}>
    <OrderInfo />
  </div>
);
