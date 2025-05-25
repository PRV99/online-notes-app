import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import noteReducer from './slices/noteSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: noteReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;