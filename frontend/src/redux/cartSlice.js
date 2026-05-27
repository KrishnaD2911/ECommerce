import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

export const checkout = createAsyncThunk('cart/checkout', async (_, { getState, rejectWithValue }) => {
  const { cart, auth } = getState();
  if (!auth.token) return rejectWithValue('Please login to checkout');

  try {
    const res = await fetch('/api/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({
        items: cart.items,
        totalPrice: cart.totalPrice,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Checkout failed');
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Load cart from local storage
const storedCart = localStorage.getItem('cartItems');
const initialItems = storedCart ? JSON.parse(storedCart) : [];

const calculateTotals = (items) => {
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% tax
  const totalPrice = subtotal + tax;
  return { totalQuantity, subtotal, tax, totalPrice };
};

const totals = calculateTotals(initialItems);

const initialState = {
  items: initialItems,
  ...totals,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.product === product._id);

      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity += 1;
          toast.success(`Increased ${product.name} quantity`);
        } else {
          toast.error(`Cannot add more. Only ${product.stock} in stock.`);
        }
      } else {
        if (product.stock > 0) {
          state.items.push({
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.image?.url || '',
            quantity: 1,
            stock: product.stock,
          });
          toast.success(`${product.name} added to cart!`);
        } else {
          toast.error('Product is out of stock');
        }
      }

      Object.assign(state, calculateTotals(state.items));
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart(state, action) {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product !== productId);
      Object.assign(state, calculateTotals(state.items));
      localStorage.setItem('cartItems', JSON.stringify(state.items));
      toast.success('Item removed from cart');
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.product === id);
      if (item) {
        if (quantity > 0 && quantity <= item.stock) {
          item.quantity = quantity;
        }
      }
      Object.assign(state, calculateTotals(state.items));
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      Object.assign(state, calculateTotals(state.items));
      localStorage.removeItem('cartItems');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkout.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        Object.assign(state, calculateTotals(state.items));
        localStorage.removeItem('cartItems');
        toast.success('Order placed successfully!');
      })
      .addCase(checkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
