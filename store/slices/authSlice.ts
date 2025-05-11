import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from '@/lib/interfaces';

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true, // app assumes it needs to check session on load
};

export const loadUserSession = createAsyncThunk(
  'auth/loadUserSession',
  async (_, { dispatch }) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user: IUser = JSON.parse(userData);
        dispatch(setAuth(user));
      } else {
        console.log('No user session found.');
      }
    } catch (error) {
      console.error('Failed to load user session', error);
    } finally {
      dispatch(setLoading(false)); // done checking session
    }
  }
);

// Logout and clear AsyncStorage
export const performLogout = createAsyncThunk(
  'auth/performLogout',
  async (_, { dispatch }) => {
    try {
      await AsyncStorage.removeItem('user');
      dispatch(logout());
      console.log('User logged out and session cleared.');
    } catch (error) {
      console.error('Logout failed', error);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<IUser>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setAuth, logout, setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
