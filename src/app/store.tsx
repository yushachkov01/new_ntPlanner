import { configureStore } from '@reduxjs/toolkit';

import { workReducer } from '@features/work/model/workSlice.ts';

export const store = configureStore({
  reducer: {
    work: workReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
