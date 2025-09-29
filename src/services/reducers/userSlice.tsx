import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserApi, updateUserApi } from '../../utils/burger-api';
import { TUser } from '../../utils/types';

interface UserState {
  user: TUser | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  updateError: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  updateStatus: 'idle',
  error: null,
  updateError: null
};

export const getUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserApi();
      return data.user;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch user';
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TUser & { password?: string }>,
  { rejectValue: string }
>('user/updateUser', async (userUpdates, { rejectWithValue }) => {
  try {
    const result = await updateUserApi(userUpdates);
    return result.user;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to update user';
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
      });
  }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
