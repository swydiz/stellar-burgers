import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

export interface IngredientsState {
  items: TIngredient[];
  isLoading: boolean;
  hasError: boolean;
}

export const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  hasError: false
};

export const fetchIngredients = createAsyncThunk<TIngredient[], void>(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getIngredientsApi();
      return response;
    } catch (err) {
      return rejectWithValue('Failed to load ingredients');
    }
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients(state, action: PayloadAction<TIngredient[]>) {
      state.items = [...action.payload];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<boolean>) {
      state.hasError = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.items = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchIngredients.rejected, (state) => {
        state.hasError = true;
        state.isLoading = false;
      });
  }
});

export const { setIngredients, setLoading, setError } =
  ingredientsSlice.actions;

export const ingredientsReducer = ingredientsSlice.reducer;
