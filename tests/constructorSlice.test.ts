import { expect } from '@jest/globals';
import {
  constructorSlice,
  initialState,
  setBun,
  addIngredient,
  constructorReducer,
  removeIngredient,
  clearConstructor,
  setOrderRequest,
  setOrderModalData,
  moveIngredient,
  ConstructorState
} from '../src/services/reducers/constructorSlice';
import { TConstructorIngredient, TOrder } from '../src/utils/types';

// Моковые данные
const mockBun: TConstructorIngredient = {
  _id: 'bun1',
  id: 'mock-id-1',
  name: 'Test Bun',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 15,
  calories: 200,
  price: 50,
  image: 'bun_image_url',
  image_mobile: 'bun_image_mobile_url',
  image_large: 'bun_image_large_url'
};

const mockIngredient: TConstructorIngredient = {
  _id: 'ingredient1',
  id: 'mock-id-1',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 15,
  calories: 200,
  price: 50,
  image: 'ingredient_image_url',
  image_mobile: 'ingredient_image_mobile_url',
  image_large: 'ingredient_image_large_url'
};

const mockOrder: TOrder = {
  _id: 'order1',
  name: 'Test Burger',
  ingredients: ['bun1', 'ingredient1'],
  status: 'done',
  number: 12345,
  createdAt: '2025-09-29T18:39:00.000Z',
  updatedAt: '2025-09-29T18:39:00.000Z'
};

jest.mock('nanoid', () => ({
  nanoid: jest.fn().mockReturnValue('unique-id-1')
}));

describe('Тестирование constructorSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window.localStorage.__proto__, 'setItem');
    jest.spyOn(window.localStorage.__proto__, 'removeItem');
    jest.spyOn(document, 'cookie', 'set');
  });

  it('Проверка начального состояния', () => {
    const state = constructorSlice.reducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    expect(state).toEqual(initialState);
  });

  it('Проверка setBun', () => {
    const stateWithBun = {
      ...initialState,
      bun: { ...mockBun, id: 'unique-id-1' }
    };
    const state = constructorReducer(
      initialState,
      setBun({ ...mockBun, id: 'unique-id-1' })
    );
    expect(state).toEqual(stateWithBun);
  });

  it('Проверка addIngredient', () => {
    const stateWithIngredient = {
      ...initialState,
      ingredients: [{ ...mockIngredient, id: 'unique-id-1' }]
    };
    const state = constructorReducer(
      initialState,
      addIngredient({ ...mockIngredient, id: 'unique-id-1' })
    );
    expect(state).toEqual(stateWithIngredient);
  });

  it('Проверка removeIngredient', () => {
    const stateWithIngredients: ConstructorState = {
      ...initialState,
      ingredients: [{ ...mockIngredient, id: 'mock-id-1' }]
    };
    const stateAfterRemove = constructorSlice.reducer(
      stateWithIngredients,
      removeIngredient('mock-id-1')
    );
    expect(stateAfterRemove).toEqual(initialState);
  });

  it('Проверка clearConstructor', () => {
    const stateWithData: ConstructorState = {
      ...initialState,
      bun: { ...mockBun, id: 'mock-id-1' },
      ingredients: [{ ...mockIngredient, id: 'mock-id-1' }],
      orderRequest: true,
      orderModalData: mockOrder
    };
    const state = constructorSlice.reducer(stateWithData, clearConstructor());
    expect(state).toEqual(initialState);
  });

  it('Проверка setOrderRequest', () => {
    const stateWithRequest: ConstructorState = {
      ...initialState,
      orderRequest: true
    };
    const state = constructorSlice.reducer(initialState, setOrderRequest(true));
    expect(state).toEqual(stateWithRequest);
  });

  it('Проверка setOrderModalData', () => {
    const stateWithModalData: ConstructorState = {
      ...initialState,
      orderModalData: mockOrder
    };
    const state = constructorSlice.reducer(
      initialState,
      setOrderModalData(mockOrder)
    );
    expect(state).toEqual(stateWithModalData);

    const stateCleared = constructorSlice.reducer(
      stateWithModalData,
      setOrderModalData(null)
    );
    expect(stateCleared.orderModalData).toBeNull();
  });

  it('Проверка moveIngredient', () => {
    const stateWithIngredients: ConstructorState = {
      ...initialState,
      ingredients: [
        { ...mockIngredient, id: 'mock-id-1' },
        { ...mockIngredient, id: 'mock-id-2' }
      ]
    };
    const stateAfterMove = constructorSlice.reducer(
      stateWithIngredients,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );
    expect(stateAfterMove.ingredients[0].id).toBe('mock-id-2');
    expect(stateAfterMove.ingredients[1].id).toBe('mock-id-1');
  });
});
