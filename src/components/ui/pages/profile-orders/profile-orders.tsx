import { FC } from 'react';
import { useAppSelector } from '../../../../services/hooks/hooks';

import styles from './profile-orders.module.css';
import { ProfileMenu, OrdersList } from '@components';
import { TOrder } from '@utils-types';

type ProfileOrdersUIProps = {
  orders: TOrder[];
};

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({ orders }) => (
  <main className={styles.main}>
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>
    <div className={`mt-10 ${styles.orders}`}>
      <OrdersList orders={orders} />
    </div>
  </main>
);
