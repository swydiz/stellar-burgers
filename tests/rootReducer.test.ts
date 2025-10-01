import { expect } from '@jest/globals';
import { rootReducer } from '../src/services/store';
import { initialState as ingredientsInitialState } from '../src/services/reducers/ingredientsSlice';
import { initialState as constructorInitialState } from '../src/services/reducers/constructorSlice';
import { initialState as ordersInitialState } from '../src/services/reducers/ordersSlice';
import { initialState as userInitialState } from '../src/services/reducers/userSlice';

describe('Тестирование rootReducer', () => {
  it('Проверка начального состояния для unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      orders: ordersInitialState,
      user: userInitialState,
    });
  });
});
