import { configureStore } from '@reduxjs/toolkit';

import { workReducer } from '../entities/work/model/workSlice';

export const store = configureStore({
  reducer: {
    work: workReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
