import React, { FC, useEffect, useMemo } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  orderModalData,
  onOrderClick,
  closeOrderModal
}) => {
  const totalPrice = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;

    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }, [constructorItems.bun, constructorItems.ingredients]);

  return (
    <section className={styles.burger_constructor}>
      {constructorItems.bun ? (
        <div className={`${styles.element} mb-4 mr-4`}>
          <ConstructorElement
            type='top'
            isLocked
            text={`${constructorItems.bun.name} (верх)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите булки
        </div>
      )}

      <ul className={styles.elements}>
        {constructorItems.ingredients.length > 0 ? (
          constructorItems.ingredients.map(
            (item: TConstructorIngredient, index: number) => (
              <BurgerConstructorElement
                ingredient={item}
                index={index}
                totalItems={constructorItems.ingredients.length}
                key={item.id}
              />
            )
          )
        ) : (
          <div
            className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
          >
            Выберите начинку
          </div>
        )}
      </ul>

      {constructorItems.bun ? (
        <div className={`${styles.element} mt-4 mr-4`}>
          <ConstructorElement
            type='bottom'
            isLocked
            text={`${constructorItems.bun.name} (низ)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите булки
        </div>
      )}

      <div className={`${styles.total} mt-10 mr-4`}>
        <div className={`${styles.cost} mr-10`}>
          <p className={`text ${styles.text} mr-2`}>{totalPrice}</p>
          <CurrencyIcon type='primary' />
        </div>
        <Button
          htmlType='button'
          type='primary'
          size='large'
          children='Оформить заказ'
          onClick={onOrderClick}
          disabled={!constructorItems.bun || orderRequest}
        />
      </div>

      {orderRequest && (
        <Modal onClose={closeOrderModal} title={'Оформляем заказ...'}>
          <Preloader />
        </Modal>
      )}

      {orderModalData && (
        <Modal
          onClose={closeOrderModal}
          title={orderRequest ? 'Оформляем заказ...' : ''}
        >
          <OrderDetailsUI orderNumber={orderModalData.number} />
        </Modal>
      )}
    </section>
  );
};
