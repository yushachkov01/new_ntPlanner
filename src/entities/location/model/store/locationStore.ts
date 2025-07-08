import { create } from 'zustand';

import * as api from '../../api/LocationApi';

interface LocationState {
  location: api.Location | null;
  load: () => Promise<void>;
}

export const locationStore = create<LocationState>((set) => ({
  location: null,
  async load() {
    const loc = await api.fetchLocation();
    set({ location: loc });
  },
}));
