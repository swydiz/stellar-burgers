import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  updateUserApi,
  registerUserApi,
  loginUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../../utils/burger-api';
import { TUser, TRegisterData, TLoginData } from '../../utils/types';

export interface UserState {
  user: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  updateError: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  status: 'idle',
  updateStatus: 'idle',
  error: null,
  updateError: null
};

// Thunk для получения профиля пользователя
export const getUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserApi();
      if (!data.success) throw new Error('Failed to fetch user data');
      return data.user;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch user';
      return rejectWithValue(message);
    }
  }
);

// Thunk для обновления профиля
export const updateUser = createAsyncThunk<
  TUser,
  Partial<TUser>,
  { rejectValue: string }
>('user/updateUser', async (userUpdates, { rejectWithValue }) => {
  try {
    const data = await updateUserApi(userUpdates);
    if (!data.success) throw new Error('Failed to update user data');
    return data.user;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to update user';
    return rejectWithValue(message);
  }
});

// Thunk для регистрации
export const register = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    if (!response.success) throw new Error('Registration failed');
    localStorage.setItem('refreshToken', response.refreshToken);
    document.cookie = `accessToken=${response.accessToken}; path=/`;
    return response.user;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to register';
    return rejectWithValue(message);
  }
});

// Thunk для логина
export const login = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);
    if (!response.success) throw new Error('Login failed');
    localStorage.setItem('refreshToken', response.refreshToken);
    document.cookie = `accessToken=${response.accessToken}; path=/`;
    return response.user;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to login';
    return rejectWithValue(message);
  }
});

// Thunk для выхода
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      if (!response.success) throw new Error('Logout failed');
      localStorage.removeItem('refreshToken');
      document.cookie = 'accessToken=; Max-Age=0; path=/'; // Очистка cookie
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to logout';
      return rejectWithValue(message);
    }
  }
);

// Thunk для запроса восстановления пароля
export const forgotPassword = createAsyncThunk<
  boolean,
  { email: string },
  { rejectValue: string }
>('user/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    const response = await forgotPasswordApi(data);
    if (!response.success) throw new Error('Failed to send reset email');
    return response.success;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to send reset email';
    return rejectWithValue(message);
  }
});

// Thunk для сброса пароля
export const resetPassword = createAsyncThunk<
  boolean,
  { password: string; token: string },
  { rejectValue: string }
>('user/resetPassword', async (data, { rejectWithValue }) => {
  try {
    const response = await resetPasswordApi(data);
    if (!response.success) throw new Error('Failed to reset password');
    return response.success;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to reset password';
    return rejectWithValue(message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.updateStatus = 'idle';
      state.error = null;
      state.updateError = null;
    },
    setIsAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    },
    clearError(state) {
      state.error = null;
      state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { ...action.payload };
        state.isAuthenticated = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.user = { ...action.payload };
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload ?? 'Unknown error';
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { ...action.payload };
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { ...action.payload };
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      });
  }
});

export { userSlice, initialState };

export default userSlice.reducer;

export const { clearUser, setIsAuthChecked, clearError } = userSlice.actions;
