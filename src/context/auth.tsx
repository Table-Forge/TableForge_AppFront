// context/auth.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter, useSegments } from "expo-router";
import { ILoginResponse } from "@/src/features/users/schemas/auth.schema";
import Toast from "react-native-toast-message";

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

  useEffect(() => {
    async function loadStorageData() {
      try {
        const authDataSerialized = await SecureStore.getItemAsync("auth_data");
        if (authDataSerialized) {
          const _authData: ILoginResponse = JSON.parse(authDataSerialized);
          setUser(_authData.user);
        }
      } catch (e) {
        console.error("Erro ao carregar sessão", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStorageData();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments.some((segment) => segment === "(auth)");

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)/campaigns");
    }
  }, [user, segments, isLoading]);

  const signIn = async (data: ILoginResponse) => {
    await SecureStore.setItemAsync("auth_data", JSON.stringify(data));
    setUser(data.user);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("auth_data");
    setUser(null);
  };

  useEffect(() => {
    async function loadStorageData() {
      try {
        const authDataSerialized = await SecureStore.getItemAsync("auth_data");

        if (authDataSerialized) {
          const _authData: ILoginResponse = JSON.parse(authDataSerialized);

          const expirationDate = new Date(_authData.token.expiration);
          const now = new Date();

          if (expirationDate > now) {
            setUser(_authData.user);
          } else {
            Toast.show({
              type: "error",
              text1: "Sessão expirada. Redirecionando...",
            });
            await SecureStore.deleteItemAsync("auth_data");
            setUser(null);
          }
        }
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Erro ao carregar sessão",
          text2: `${e}`,
        });
        await SecureStore.deleteItemAsync("auth_data");
      } finally {
        setIsLoading(false);
      }
    }
    loadStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
