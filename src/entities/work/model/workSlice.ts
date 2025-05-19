import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { Work } from './work';

interface WorkState {
  items: Work[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkState = {
  items: [],
  loading: false,
  error: null,
};

const workSlice = createSlice({
  name: 'work',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess(state, action: PayloadAction<Work[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // Пример локального действия:
    updateStatus(state, action: PayloadAction<{ id: number; status: Work['status'] }>) {
      const w = state.items.find((item) => item.id === action.payload.id);
      if (w) w.status = action.payload.status;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, updateStatus } = workSlice.actions;

export const workReducer = workSlice.reducer;
