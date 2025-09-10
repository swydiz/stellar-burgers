import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import {
  addIngredient,
  setBun
} from '../../services/reducers/constructorSlice';
import { TConstructorIngredient } from '@utils-types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient }) => {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const bun = useAppSelector((s) => s.burgerConstructor.bun);
    const ingredients = useAppSelector((s) => s.burgerConstructor.ingredients);

    const count = useMemo(() => {
      if (ingredient.type === 'bun') {
        return bun && bun._id === ingredient._id ? 2 : 0;
      }
      return ingredients.filter((i) => i._id === ingredient._id).length;
    }, [bun, ingredients, ingredient]);

    const handleAdd = () => {
      const uid = uuidv4();

      const ingredientWithUid: TConstructorIngredient = {
        ...ingredient,
        id: nanoid()
      };

      if (ingredient.type === 'bun') {
        dispatch(setBun(ingredientWithUid));
      } else {
        dispatch(addIngredient(ingredientWithUid));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
