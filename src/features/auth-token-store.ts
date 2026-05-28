import * as SecureStore from "expo-secure-store";

import { ILoginResponse } from "@/src/features/users/schemas/auth.schema";

const AUTH_STORAGE_KEY = "auth_data";

let cachedToken: string | null = null;
let cachedAuthData: ILoginResponse | null = null;
let hydrationPromise: Promise<void> | null = null;

const hydrate = async () => {
  try {
    const serialized = await SecureStore.getItemAsync(AUTH_STORAGE_KEY);
    if (!serialized) return;

    const parsed = JSON.parse(serialized) as ILoginResponse;
    cachedAuthData = parsed;
    cachedToken = parsed.token?.value ?? null;
  } catch {
    cachedAuthData = null;
    cachedToken = null;
  }
};

export const authTokenStore = {
  getToken: () => cachedToken,
  getAuthData: () => cachedAuthData,
  setAuthData: async (data: ILoginResponse) => {
    cachedAuthData = data;
    cachedToken = data.token?.value ?? null;
    await SecureStore.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(data));
  },
  clear: async () => {
    cachedAuthData = null;
    cachedToken = null;
    await SecureStore.deleteItemAsync(AUTH_STORAGE_KEY);
  },
  hydrate: () => {
    if (!hydrationPromise) {
      hydrationPromise = hydrate();
    }
    return hydrationPromise;
  },
};

export { AUTH_STORAGE_KEY };
