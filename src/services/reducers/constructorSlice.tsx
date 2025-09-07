import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TConstructorIngredient>) {
      state.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      state.ingredients = [...state.ingredients, action.payload];
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.uid !== action.payload
      );
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },
    setOrderRequest(state, action: PayloadAction<boolean>) {
      state.orderRequest = action.payload;
    },
    setOrderModalData(state, action: PayloadAction<TOrder | null>) {
      state.orderModalData = action.payload;
    },
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const ingredientsCopy = [...state.ingredients];
      const [itemToMove] = ingredientsCopy.splice(fromIndex, 1);
      ingredientsCopy.splice(toIndex, 0, itemToMove);
      state.ingredients = ingredientsCopy;
    }
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  clearConstructor,
  setOrderRequest,
  setOrderModalData,
  moveIngredient
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
