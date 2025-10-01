import { expect } from '@jest/globals';
import {
  ingredientsSlice,
  initialState,
  fetchIngredients,
  setIngredients,
  setLoading,
  setError,
  IngredientsState,
} from '../src/services/reducers/ingredientsSlice';
import { TIngredient } from '../src/utils/types';
import * as burgerApi from '../src/utils/burger-api'; // Импорт модуля burger-api

// Моковые данные
const mockIngredient: TIngredient = {
  _id: 'ingredient1',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 15,
  calories: 200,
  price: 50,
  image: 'image_url',
  image_mobile: 'image_mobile_url',
  image_large: 'image_large_url',
};

const mockIngredients: TIngredient[] = [mockIngredient];

describe('Тестирование ingredientsSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window.localStorage.__proto__, 'setItem');
    jest.spyOn(window.localStorage.__proto__, 'removeItem');
    jest.spyOn(document, 'cookie', 'set');
  });

  it('Проверка начального состояния', () => {
    const state = ingredientsSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  it('Проверка setIngredients', () => {
    const stateWithIngredients: IngredientsState = {
      ...initialState,
      items: mockIngredients,
    };
    const state = ingredientsSlice.reducer(initialState, setIngredients(mockIngredients));
    expect(state).toEqual(stateWithIngredients);
  });

  it('Проверка setLoading', () => {
    const stateWithLoading: IngredientsState = {
      ...initialState,
      isLoading: true,
    };
    const state = ingredientsSlice.reducer(initialState, setLoading(true));
    expect(state).toEqual(stateWithLoading);
  });

  it('Проверка setError', () => {
    const stateWithError: IngredientsState = {
      ...initialState,
      hasError: true,
    };
    const state = ingredientsSlice.reducer(initialState, setError(true));
    expect(state).toEqual(stateWithError);
  });

  describe('fetchIngredients', () => {
    it('Проверка fetchIngredients.pending', () => {
      const pendingAction = { type: fetchIngredients.pending.type };
      const state = ingredientsSlice.reducer(initialState, pendingAction);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        hasError: false,
      });
    });

    it('Проверка fetchIngredients.fulfilled', () => {
      const fulfilledAction = fetchIngredients.fulfilled(mockIngredients, 'requestId', undefined);
      const state = ingredientsSlice.reducer(initialState, fulfilledAction);
      expect(state).toEqual({
        ...initialState,
        items: mockIngredients,
        isLoading: false,
      });
    });

    it('Проверка fetchIngredients.rejected', () => {
      const rejectedAction = fetchIngredients.rejected(null, 'requestId', undefined, 'Failed to load ingredients');
      const state = ingredientsSlice.reducer(initialState, rejectedAction);
      expect(state).toEqual({
        ...initialState,
        hasError: true,
        isLoading: false,
      });
    });
  });

  describe('fetchIngredients thunk', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(burgerApi, 'getIngredientsApi').mockResolvedValue(mockIngredients);
    });

    it('dispatches fulfilled when fetch succeeds', async () => {
      const mockDispatch = jest.fn();
      const mockGetState = jest.fn().mockReturnValue({ ingredients: initialState });

      await fetchIngredients()(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'ingredients/fetchIngredients/pending',
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'ingredients/fetchIngredients/fulfilled',
          payload: mockIngredients,
        })
      );
      expect(burgerApi.getIngredientsApi).toHaveBeenCalledTimes(1);
    });

    it('dispatches rejected when fetch fails', async () => {
      const mockDispatch = jest.fn();
      const mockGetState = jest.fn().mockReturnValue({ ingredients: initialState });
      const errorMessage = 'Failed to load ingredients';
      jest.spyOn(burgerApi, 'getIngredientsApi').mockRejectedValueOnce(new Error(errorMessage));

      await fetchIngredients()(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'ingredients/fetchIngredients/pending',
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'ingredients/fetchIngredients/rejected',
          payload: errorMessage,
        })
      );
      expect(burgerApi.getIngredientsApi).toHaveBeenCalledTimes(1);
    });
  });
});
