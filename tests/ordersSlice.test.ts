import { expect } from '@jest/globals';
import {
  ordersSlice,
  initialState,
  fetchOrders,
  fetchFeeds,
  addOrder,
  clearOrder,
  setCurrentOrder,
  OrdersState,
  fetchOrder,
  createOrder
} from '../src/services/reducers/ordersSlice';
import { TOrder } from '../src/utils/types';
import * as burgerApi from '../src/utils/burger-api';

// Моковые данные
const mockOrder: TOrder = {
  _id: 'order1',
  name: 'Test Burger',
  ingredients: ['bun1', 'main1'],
  status: 'done',
  number: 12345,
  createdAt: '2025-09-27T00:00:00.000Z',
  updatedAt: '2025-09-27T00:00:00.000Z',
};

const mockOrders: TOrder[] = [mockOrder];
const mockIngredients: string[] = ['bun1', 'main1'];
const mockFeedsResponse = {
  orders: mockOrders,
  total: 100,
  totalToday: 10,
};

describe('Тестирование ordersSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window.localStorage.__proto__, 'setItem');
    jest.spyOn(window.localStorage.__proto__, 'removeItem');
    jest.spyOn(document, 'cookie', 'set');
  });

  it('Проверка начального состояния', () => {
    const state = ordersSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  it('Проверка addOrder', () => {
    const stateWithOrder: OrdersState = {
      ...initialState,
      orders: [mockOrder],
    };
    const state = ordersSlice.reducer(initialState, addOrder(mockOrder));
    expect(state).toEqual(stateWithOrder);
  });

  it('Проверка clearOrder', () => {
    const stateWithData: OrdersState = {
      ...initialState,
      orders: mockOrders,
      total: 50,
      totalToday: 5,
    };
    const state = ordersSlice.reducer(stateWithData, clearOrder());
    expect(state).toEqual(initialState);
  });

  it('Проверка setCurrentOrder', () => {
    const stateWithCurrentOrder: OrdersState = {
      ...initialState,
      currentOrder: mockOrder,
    };
    const state = ordersSlice.reducer(initialState, setCurrentOrder(mockOrder));
    expect(state).toEqual(stateWithCurrentOrder);

    const stateCleared = ordersSlice.reducer(stateWithCurrentOrder, setCurrentOrder(null));
    expect(stateCleared).toEqual(initialState);
  });

  describe('fetchOrders', () => {
    it('Проверка fetchOrders.pending', () => {
      const state = ordersSlice.reducer(initialState, fetchOrders.pending(''));
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    it('Проверка fetchOrders.fulfilled', () => {
      const state = ordersSlice.reducer(initialState, fetchOrders.fulfilled(mockOrders, ''));
      expect(state).toEqual({
        ...initialState,
        loading: false,
        orders: mockOrders,
      });
    });

    it('Проверка fetchOrders.rejected', () => {
      const errorMessage = 'Failed to fetch orders';
      const state = ordersSlice.reducer(initialState, {
        type: fetchOrders.rejected.type,
        payload: errorMessage,
      });
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage,
      });
    });
  });

  describe('fetchFeeds', () => {
    it('Проверка fetchFeeds.pending', () => {
      const state = ordersSlice.reducer(initialState, fetchFeeds.pending(''));
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    it('Проверка fetchFeeds.fulfilled', () => {
      const state = ordersSlice.reducer(initialState, fetchFeeds.fulfilled(mockFeedsResponse, ''));
      expect(state).toEqual({
        ...initialState,
        loading: false,
        orders: mockOrders,
        total: mockFeedsResponse.total,
        totalToday: mockFeedsResponse.totalToday,
      });
    });

    it('Проверка fetchFeeds.rejected', () => {
      const errorMessage = 'Failed to fetch feeds';
      const state = ordersSlice.reducer(initialState, {
        type: fetchFeeds.rejected.type,
        payload: errorMessage,
      });
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage,
      });
    });
  });

  describe('fetchFeeds thunk', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(burgerApi, 'getFeedsApi').mockResolvedValue({
        success: true,
        ...mockFeedsResponse,
      });
    });

    it('dispatches fulfilled when fetch succeeds', async () => {
      const mockDispatch = jest.fn();
      const mockGetState = jest.fn().mockReturnValue({ orders: initialState });

      await fetchFeeds()(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchFeeds.pending.type,
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchFeeds.fulfilled.type,
          payload: mockFeedsResponse,
        })
      );
      expect(burgerApi.getFeedsApi).toHaveBeenCalledTimes(1);
    });

    it('dispatches rejected when fetch fails', async () => {
      const mockDispatch = jest.fn();
      const mockGetState = jest.fn().mockReturnValue({ orders: initialState });
      const errorMessage = 'Failed to fetch feeds';
      jest.spyOn(burgerApi, 'getFeedsApi').mockRejectedValueOnce(new Error(errorMessage));

      await fetchFeeds()(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchFeeds.pending.type,
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchFeeds.rejected.type,
          payload: errorMessage,
        })
      );
      expect(burgerApi.getFeedsApi).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchOrders thunk', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(burgerApi, 'getOrdersApi').mockResolvedValue(mockOrders);
    });

    it('dispatches fulfilled when fetch succeeds', async () => {
      const mockDispatch = jest.fn();
      const mockGetState = jest.fn().mockReturnValue({ orders: initialState });

      await fetchOrders()(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchOrders.pending.type,
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchOrders.fulfilled.type,
          payload: mockOrders,
        })
      );
      expect(burgerApi.getOrdersApi).toHaveBeenCalledTimes(1);
    });

    it('dispatches rejected when fetch fails', async () => {
      const mockDispatch = jest.fn();
      const mockGetState = jest.fn().mockReturnValue({ orders: initialState });
      const errorMessage = 'Failed to fetch orders';
      jest.spyOn(burgerApi, 'getOrdersApi').mockRejectedValueOnce(new Error(errorMessage));

      await fetchOrders()(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchOrders.pending.type,
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchOrders.rejected.type,
          payload: errorMessage,
        })
      );
      expect(burgerApi.getOrdersApi).toHaveBeenCalledTimes(1);
    });
  });

  describe('createOrder thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(burgerApi, 'orderBurgerApi').mockResolvedValue({
      success: true,
      order: mockOrder,
      name: mockOrder.name,
    });
  });

  it('dispatches fulfilled when order creation succeeds', async () => {
    const mockDispatch = jest.fn();
    const mockGetState = jest.fn().mockReturnValue({ orders: initialState });

    await createOrder(mockIngredients)(mockDispatch, mockGetState, undefined);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'orders/createOrder/pending',
      })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'orders/createOrder/fulfilled',
        payload: mockOrder,
      })
    );
    expect(burgerApi.orderBurgerApi).toHaveBeenCalledWith(mockIngredients);
    expect(burgerApi.orderBurgerApi).toHaveBeenCalledTimes(1);
  });

  it('dispatches rejected when order creation fails', async () => {
    const mockDispatch = jest.fn();
    const mockGetState = jest.fn().mockReturnValue({ orders: initialState });
    const errorMessage = 'Failed to create order';
    jest.spyOn(burgerApi, 'orderBurgerApi').mockRejectedValueOnce(new Error(errorMessage));

    await createOrder(mockIngredients)(mockDispatch, mockGetState, undefined);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'orders/createOrder/pending',
      })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'orders/createOrder/rejected',
        payload: errorMessage,
      })
    );
    expect(burgerApi.orderBurgerApi).toHaveBeenCalledWith(mockIngredients);
    expect(burgerApi.orderBurgerApi).toHaveBeenCalledTimes(1);
  });
  
});
describe('fetchOrder thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(burgerApi, 'getOrderByNumberApi').mockResolvedValue({
      success: true,
      orders: [mockOrder],
    });
  });

  it('dispatches fulfilled when fetch succeeds', async () => {
    const mockDispatch = jest.fn();
    const mockGetState = jest.fn().mockReturnValue({ orders: initialState });

    await fetchOrder(12345)(mockDispatch, mockGetState, undefined);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'orders/fetchOrder/pending',
      })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'orders/fetchOrder/fulfilled',
        payload: mockOrder,
      })
    );
    expect(burgerApi.getOrderByNumberApi).toHaveBeenCalledWith(12345);
    expect(burgerApi.getOrderByNumberApi).toHaveBeenCalledTimes(1);
  });

  it('dispatches rejected when fetch fails', async () => {
    const mockDispatch = jest.fn();
    const mockGetState = jest.fn().mockReturnValue({ orders: initialState });
    const errorMessage = 'Failed to fetch order';
    jest.spyOn(burgerApi, 'getOrderByNumberApi').mockRejectedValueOnce(new Error(errorMessage));

    await fetchOrder(12345)(mockDispatch, mockGetState, undefined);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'orders/fetchOrder/pending',
      })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'orders/fetchOrder/rejected',
        payload: errorMessage,
      })
    );
    expect(burgerApi.getOrderByNumberApi).toHaveBeenCalledWith(12345);
    expect(burgerApi.getOrderByNumberApi).toHaveBeenCalledTimes(1);
  });
});
});
