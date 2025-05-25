// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import productions from "./productions";

export const store = configureStore({
  reducer: {
    nft: productions,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
