import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getOrdersApi,
  getFeedsApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';

export interface OrdersState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
}

const initialState: OrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  currentOrder: null
};

export const fetchFeeds = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('orders/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();
    return {
      orders: [...response.orders],
      total: response.total,
      totalToday: response.totalToday
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to fetch feeds';
    return rejectWithValue(message);
  }
});

export const fetchOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const result = await getOrdersApi();
    return [...result];
  } catch {
    return rejectWithValue('Failed to fetch orders');
  }
});

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('orders/createOrder', async (ingredients, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredients);
    if (!response.success) throw new Error('Failed to create order');
    return response.order;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to create order';
    return rejectWithValue(message);
  }
});

export const fetchOrder = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orders/fetchOrder', async (orderNumber, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(orderNumber);
    if (!response.success) throw new Error('Failed to fetch order');
    return response.orders[0];
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to fetch order';
    return rejectWithValue(message);
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<TOrder>) {
      state.orders = [action.payload, ...state.orders];
    },
    clearOrder(state) {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    },
    setCurrentOrder(state, action: PayloadAction<TOrder | null>) {
      state.currentOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          state.orders = [...action.payload];
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      })
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (
          state,
          action: PayloadAction<{
            orders: TOrder[];
            total: number;
            totalToday: number;
          }>
        ) => {
          state.loading = false;
          state.orders = [...action.payload.orders];
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.loading = false;
          state.currentOrder = action.payload;
          state.orders = [action.payload, ...state.orders];
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      })
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      });
  }
});

export const { addOrder, clearOrder, setCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
export { ordersSlice, initialState };
