import { configureStore } from '@reduxjs/toolkit';

import { workApi } from '@features/work/api/workApi.ts';

export const store = configureStore({
  reducer: {
    [workApi.reducerPath]: workApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(workApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
