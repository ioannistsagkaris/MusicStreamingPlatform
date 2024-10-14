import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthProps {
  authState?: { accessToken: string | null; isAuthenticated: boolean | null };
  loadingState?: { isLoading: boolean };
  expirationState?: { isExpired: boolean | null };
  onSignUp?: (
    email: string,
    username: string,
    password: string,
  ) => Promise<any>;
  onSignIn?: (email: string, password: string) => Promise<any>;
  onSignOut?: () => Promise<any>;
  onUpdate?: (
    newEmail: string,
    newUsername: string,
    newPassword: string,
    token: string,
  ) => Promise<any>;
  onDelete?: (token: string) => Promise<any>;
  onRole?: (token: string) => Promise<any>;
  getUser?: (token: string) => Promise<any>;
  onAddLikedSong?: (token: string, idSong: string) => Promise<any>;
  onRemoveLikedSong?: (token: string, idSong: string) => Promise<any>;
}

export const URL_AUTH = "http://192.168.1.5:3000/auth/";
export const URL_USER = "http://192.168.1.5:3000/user/me/";

const AuthContext = createContext<AuthProps>({});
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    accessToken: string | null;
    isAuthenticated: boolean | null;
  }>({
    accessToken: null,
    isAuthenticated: false,
  });
  const [loadingState, setLoadingState] = useState<{
    isLoading: boolean;
  }>({
    isLoading: false,
  });

  useEffect(() => {
    const loadToken = async () => {
      try {
        setLoadingState({
          isLoading: true,
        });

        const token = await AsyncStorage.getItem("accessToken");

        if (token != null) {
          await axios.get(`${URL_USER}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setAuthState({
            accessToken: token,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            accessToken: null,
            isAuthenticated: false,
          });
        }

        setLoadingState({
          isLoading: false,
        });
      } catch (error) {
        setLoadingState({
          isLoading: false,
        });

        setAuthState({
          accessToken: null,
          isAuthenticated: false,
        });

        return {
          error: true,
          message: (error as any).response.data.message,
          statusCode: (error as any).response.data.statusCode,
        };
      }
    };

    loadToken();
  }, []);

  const signup = async (email: string, username: string, password: string) => {
    try {
      const result = await axios.post(`${URL_AUTH}signup`, {
        email,
        username,
        password,
      });

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${result.data.accessToken}`;

      setAuthState({
        accessToken: result.data.accessToken,
        isAuthenticated: true,
      });

      await AsyncStorage.setItem("accessToken", result.data.accessToken);

      return result;
    } catch (error) {

      return {
        error: true,
        message: (error as any).response.data.message,
        statusCode: (error as any).response.data.statusCode,
      };
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      const result = await axios.post(`${URL_AUTH}signin`, { email, password });

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${result.data.accessToken}`;

      setAuthState({
        accessToken: result.data.accessToken,
        isAuthenticated: true,
      });

      await AsyncStorage.setItem("accessToken", result.data.accessToken);

      return result;
    } catch (error) {
      return {
        error: true,
        message: (error as any).response.data.message,
        statusCode: (error as any).response.data.statusCode,
      };
    }
  };

  const signout = async () => {
    try {
      setLoadingState({
        isLoading: true,
      });
  
      await AsyncStorage.removeItem("accessToken");
  
      axios.defaults.headers.common["Authorization"] = "";
  
      setAuthState({
        accessToken: null,
        isAuthenticated: false,
      });
  
      setLoadingState({
        isLoading: false,
      });
    } catch (error) {
      setLoadingState({
        isLoading: false,
      });

      return {
        error: true,
        message: (error as any).response.data.message,
        statusCode: (error as any).response.data.statusCode,
      };
    }
  };

  const updateUser = async (
    newEmail: string,
    newUsername: string,
    newPassword: string,
    token: string,
  ) => {
    try {
      setLoadingState({
        isLoading: true,
      });

      await axios.get(`${URL_USER}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await axios.post(`${URL_AUTH}update`, {
        newEmail,
        newUsername,
        newPassword,
        token,
      });

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${result.data.accessToken}`;

      setAuthState({
        accessToken: result.data.accessToken,
        isAuthenticated: true,
      });

      await AsyncStorage.setItem("accessToken", result.data.accessToken);

      setLoadingState({
        isLoading: false,
      });

      return result;
    } catch (error) {
      setLoadingState({
        isLoading: false,
      });

      return {
        error: true,
        message: (error as any).response.data.message,
        statusCode: (error as any).response.data.statusCode,
      };
    }
  };

  const deleteUser = async (token: string) => {
    try {
      setLoadingState({
        isLoading: true,
      });

      await axios.get(`${URL_USER}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await axios.post(`${URL_AUTH}delete`, { token });

      await AsyncStorage.removeItem("accessToken");

      axios.defaults.headers.common["Authorization"] = "";

      setAuthState({
        accessToken: null,
        isAuthenticated: false,
      });

      setLoadingState({
        isLoading: false,
      });

      return result;
    } catch (error) {
      setLoadingState({
        isLoading: false,
      });

      return {
        error: true,
        message: (error as any).response.data.message,
        statusCode: (error as any).response.data.statusCode,
      };
    }
  };

  const role = async (token: string) => {
    try {
      setLoadingState({
        isLoading: true,
      });

      const result = await axios.post(`${URL_AUTH}role`, { token });

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${result.data.accessToken}`;

      setAuthState({
        accessToken: result.data.accessToken,
        isAuthenticated: true,
      });

      await AsyncStorage.setItem("accessToken", result.data.accessToken);

      setLoadingState({
        isLoading: false,
      });

      return result;
    } catch (error) {
      return {
        error: true,
        message: (error as any).response.data.message,
        statusCode: (error as any).response.data.statusCode,
      };
    }
  };

  const user = async (token: string) => {
    try {
      const result = await axios.get(`${URL_USER}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return result;
    } catch (error) {
      setAuthState({
        accessToken: null,
        isAuthenticated: false,
      });

      return {
        error: true,
        message: (error as any).response.data.message,
        statusCode: (error as any).response.data.statusCode,
      };
    }
  };

  const addLikedSong = async (token: string, idSong: string) => {
    try {
      await axios.get(`${URL_USER}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      await axios.post(`${URL_AUTH}addLike`, { token, idSong });
    } catch (error) {
      setAuthState({
        accessToken: null,
        isAuthenticated: false,
      });

      return {
        error: true,
        message: (error as any).response.data.message,
        statusCode: (error as any).response.data.statusCode,
      };
    }
  };

  const removeLikedSong = async (token: string, idSong: string) => {
    try {
      await axios.get(`${URL_USER}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      await axios.post(`${URL_AUTH}removeLike`, { token, idSong });
    } catch (error) {
      setAuthState({
        accessToken: null,
        isAuthenticated: false,
      });
      
      return {
        error: true,
        message: (error as any).response.data.message,
        statusCode: (error as any).response.data.statusCode,
      };
    }
  };

  const value = {
    onSignUp: signup,
    onSignIn: signin,
    onSignOut: signout,
    onUpdate: updateUser,
    onDelete: deleteUser,
    onRole: role,
    getUser: user,
    onAddLikedSong: addLikedSong,
    onRemoveLikedSong: removeLikedSong,
    authState,
    loadingState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
