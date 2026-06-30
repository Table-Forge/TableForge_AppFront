import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, useSegments } from "expo-router";
import Toast from "react-native-toast-message";
import { useQueryClient } from "@tanstack/react-query";

import { authTokenStore } from "@/src/features/auth-token-store";
import { ILoginResponse } from "@/src/features/users/schemas/auth.schema";

interface AuthContextProps {
  user: ILoginResponse["user"] | null;
  signIn: (data: ILoginResponse) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ILoginResponse["user"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    async function loadStorageData() {
      try {
        await authTokenStore.hydrate();
        const authData = authTokenStore.getAuthData();

        if (!authData) return;

        const expirationDate = new Date(authData.token.expiration);
        const now = new Date();

        if (expirationDate > now) {
          setUser(authData.user);
        } else {
          Toast.show({
            type: "error",
            text1: "Sessão expirada. Redirecionando...",
          });
          await authTokenStore.clear();
          queryClient.clear();
          setUser(null);
        }
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Erro ao carregar sessão",
          text2: `${e}`,
        });
        await authTokenStore.clear();
        queryClient.clear();
      } finally {
        setIsLoading(false);
      }
    }
    loadStorageData();
  }, [queryClient]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments.some((segment) => segment === "(auth)");

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)/campaigns");
    }
  }, [user, segments, isLoading, router]);

  const signIn = async (data: ILoginResponse) => {
    await authTokenStore.setAuthData(data);
    setUser(data.user);
  };

  const signOut = async () => {
    await authTokenStore.clear();
    queryClient.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
