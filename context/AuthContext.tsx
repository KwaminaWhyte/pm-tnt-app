import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextProps {
  auth: { token: string; user: any } | null;
  authLoading: boolean;
  login: (authData: { token: string; user: any }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<{ token: string; user: any } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchAuth = async () => {
    setAuthLoading(true);
    try {
      const storedAuth = await AsyncStorage.getItem("auth");
      if (storedAuth !== null) {
        setAuth(JSON.parse(storedAuth));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (authData: { token: string; user: any }) => {
    setAuth(authData);
    await AsyncStorage.setItem("auth", JSON.stringify(authData));
  };

  const logout = async () => {
    setAuth(null);
    await AsyncStorage.removeItem("auth");
  };

  useEffect(() => {
    fetchAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
