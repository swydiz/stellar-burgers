import { expect } from '@jest/globals';
import {
  UserState,
  userSlice,
  initialState,
  getUser,
  updateUser,
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  clearUser,
  setIsAuthChecked,
  clearError
} from '../src/services/reducers/userSlice';
import { TUser, TRegisterData, TLoginData } from '../src/utils/types';

// Моковые данные
const mockUser: TUser = { email: 'test@example.com', name: 'Test User' };
const mockRegisterData: TRegisterData = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'password123'
};
const mockLoginData: TLoginData = {
  email: 'test@example.com',
  password: 'password123'
};

describe('Тестирование userSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window.localStorage.__proto__, 'setItem');
    jest.spyOn(window.localStorage.__proto__, 'removeItem');
    jest.spyOn(document, 'cookie', 'set');
  });

  it('Проверка начального состояния', () => {
    const state = userSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  it('Проверка clearUser', () => {
    const stateWithData: UserState = {
      ...initialState,
      user: mockUser,
      isAuthenticated: true,
      status: 'succeeded',
      updateStatus: 'succeeded'
    };
    const state = userSlice.reducer(stateWithData, clearUser());
    expect(state).toEqual(initialState);
  });

  it('Проверка setIsAuthChecked', () => {
    const state = userSlice.reducer(initialState, setIsAuthChecked(true));
    expect(state).toEqual({ ...initialState, isAuthChecked: true });
  });

  it('Проверка clearError', () => {
    const stateWithError = {
      ...initialState,
      error: 'Some error',
      updateError: 'Update error'
    };
    const state = userSlice.reducer(stateWithError, clearError());
    expect(state).toEqual({ ...initialState, error: null, updateError: null });
  });

  describe('getUser', () => {
    it('Проверка getUser.pending', () => {
      const state = userSlice.reducer(initialState, getUser.pending(''));
      expect(state).toEqual({
        ...initialState,
        status: 'loading',
        error: null
      });
    });

    it('Проверка getUser.fulfilled', () => {
      const state = userSlice.reducer(
        initialState,
        getUser.fulfilled(mockUser, '')
      );
      expect(state).toEqual({
        ...initialState,
        status: 'succeeded',
        user: mockUser,
        isAuthenticated: true
      });
    });

    it('Проверка getUser.rejected', () => {
      const errorMessage = 'Failed to fetch user';
      const state = userSlice.reducer(initialState, {
        type: getUser.rejected.type,
        payload: errorMessage
      });
      expect(state).toEqual({
        ...initialState,
        status: 'failed',
        error: errorMessage,
        user: null,
        isAuthenticated: false
      });
    });
  });

});
