import { Location } from 'react-router-dom';
import { TIngredient, TOrder } from '@utils-types';

export type OrderCardUIProps = {
  orderInfo: TOrderInfo;
  maxIngredients: number;
  locationState: { background: Location };
};

type TOrderInfo = {
  ingredientsInfo: TIngredient[];
  ingredientsToShow: TIngredient[];
  remains: number;
  total: number;
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};
