import React, { FC, memo } from 'react';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';
import { OrderStatus } from '../../order-status';
import styles from './order-info.module.css';
import { OrderInfoUIProps } from './type';

export const OrderInfoUI: FC<OrderInfoUIProps> = memo(({ orderInfo }) => {
  console.log('OrderInfoUI rendering with status:', orderInfo.status);
  return (
    <div className={styles.wrap}>
      <span className={`text text_type_digits-default ${styles.number}`}>
        #{String(orderInfo.number).padStart(6, '0')}
      </span>
      <h3 className={`text text_type_main-medium pb-3 pt-10 ${styles.header}`}>
        {orderInfo.name}
      </h3>
      <OrderStatus status={orderInfo.status} />
      <p className='text text_type_main-medium pt-15 pb-6'>Состав:</p>
      <ul className={`${styles.list} mb-8`}>
        {orderInfo.ingredientsInfo &&
          Object.values(orderInfo.ingredientsInfo).map((item) => (
            <li className={`pb-4 pr-6 ${styles.item}`} key={item._id}>
              <div className={styles.img_wrap}>
                <div className={styles.border}>
                  <img
                    className={styles.img}
                    src={item.image_mobile || ''}
                    alt={item.name || 'Ингредиент'}
                  />
                </div>
              </div>
              <span className='text text_type_main-default pl-4'>
                {item.name || 'Неизвестный ингредиент'}
              </span>
              <span
                className={`text text_type_digits-default pl-4 pr-4 ${styles.quantity}`}
              >
                {item.count || 1} x {item.price || 0}
              </span>
              <CurrencyIcon type='primary' />
            </li>
          ))}
      </ul>
      <div className={styles.bottom}>
        <p className='text text_type_main-default text_color_inactive'>
          <FormattedDate date={new Date(orderInfo.createdAt)} />
        </p>
        <span className={`text text_type_digits-default pr-4 ${styles.total}`}>
          {orderInfo.total || 0}
        </span>
        <CurrencyIcon type='primary' />
      </div>
    </div>
  );
});
