import { FC } from 'react';
import styles from './ingredient-details.module.css';
import { IngredientDetails } from '../../components/ingredient-details/ingredient-details';

export const IngredientDetailPage: FC = () => (
  <div className={styles.containerMain}>
    <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
      Детали ингредиента
    </h1>
    <IngredientDetails />
  </div>
);
