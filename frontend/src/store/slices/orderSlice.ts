import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, CreateOrderData } from '../../types';
import { orderApi } from '../../services/api';
import { fetchProducts } from './productSlice';

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    const response = await orderApi.getOrders();
    return response.data.data; // Extract data from API response
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: CreateOrderData, { dispatch }) => {
    const response = await orderApi.createOrder(orderData);
    // Refresh products to get updated stock
    dispatch(fetchProducts() as any);
    return response.data.data; // Extract data from API response
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: string) => {
    const response = await orderApi.getOrderById(id);
    return response.data.data; // Extract data from API response
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create order';
      });
  },
});

export default orderSlice.reducer;

