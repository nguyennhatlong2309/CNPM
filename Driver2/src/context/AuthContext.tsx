import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { setApiToken } from '../services/api';
import storage from '../utils/storage';

interface User {
  id: string;
  name: string;
  phone?: string;
  plate?: string;
  vehicleType?: string;
  license?: string;
  busStatus?: string;
  shiftStart?: string;
  shiftEnd?: string;
  status?: 'active' | 'inactive';
  dayOfWeek?: string;
  routeName?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const defaultUser: User = {
  id: '',
  name: 'Guest',
  phone: '',
  plate: 'Chưa cập nhật',
  license: 'Chưa cập nhật',
  busStatus: 'Chưa cập nhật',
  shiftStart: 'Chưa phân ca',
  shiftEnd: 'Chưa cập nhật',
  status: 'inactive',
  dayOfWeek: 'Chưa cập nhật',
  routeName: 'Chưa cập nhật'
};

const AuthContext = createContext<AuthContextType>({ 
  token: null, 
  user: null, 
  isLoading: true, 
  signIn: async () => defaultUser, 
  signOut: async () => {}
});

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to persist user data to storage
  const persistUserData = async (userData: User) => {
    try {
      await storage.set(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to persist user data:', error);
    }
  };

  // Function to clear user data from storage
  const clearUserData = async () => {
    try {
      await storage.remove(USER_DATA_KEY);
      await storage.remove(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  };

  // Function to fetch user data using the stored token
  const fetchUserData = async (token: string): Promise<User> => {
    try {
      setApiToken(token);
      
      // First try to get user data from the server
      try {
        // The server doesn't have a /driver/profile endpoint, so we'll use the data from login
        // which is already stored in the state
        if (user) {
          console.log('Using existing user data from state');
          return user;
        }
        
        // If no user in state, try to get from storage
        const cachedUser = await storage.get(USER_DATA_KEY);
        if (cachedUser) {
          console.log('Using cached user data');
          return JSON.parse(cachedUser);
        }
        
        throw new Error('No user data available');
        
      } catch (error) {
        console.warn('Failed to fetch fresh user data, using cached data:', error);
      }
      
      // If server fetch fails, try to use cached data
      const cachedUser = await storage.get(USER_DATA_KEY);
      if (cachedUser) {
        return JSON.parse(cachedUser);
      }
      
      throw new Error('No user data available');
      
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      await clearUserData();
      throw error;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadAuthData = async () => {
      try {
        // Try to get token from storage
        const storedToken = await storage.get(AUTH_TOKEN_KEY);
        
        if (!storedToken) {
          console.log('No auth token found in storage');
          return;
        }
        
        // Set the token
        setToken(storedToken);
        setApiToken(storedToken);
        
        // Try to load user data
        try {
          const userData = await fetchUserData(storedToken);
          if (isMounted) {
            setUser(userData);
          }
        } catch (error) {
          console.error('Failed to load user data, logging out:', error);
          if (isMounted) {
            setUser(null);
            setToken(null);
            setApiToken(null);
            await clearUserData();
          }
        }
        
      } catch (error) {
        console.error('Failed to load auth data:', error);
        if (isMounted) {
          setUser(null);
          setToken(null);
          await clearUserData();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAuthData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      
      console.log('Attempting login with:', { username: username.trim() });
      
      // Make login request
      const res = await api.post('/auth/driver/login', { 
        username: username.trim(),
        password: password
      });
      
      console.log('Login response:', res.data);
      
      // The server returns { token, user: { id, name, phone, ... } }
      const responseData = res.data;
      console.log('Login response data:', JSON.stringify(responseData, null, 2));
      
      // Check if we have the expected response structure
      if (!responseData.token || !responseData.user) {
        console.error('Invalid response format:', responseData);
        throw new Error('Đăng nhập thất bại: Dữ liệu không hợp lệ');
      }
      
      const { token, user: userData } = responseData;
      
      // Format user data with all available fields from the server
      const formattedUser = {
        id: userData.id || userData.MATX,
        name: userData.name || userData.TenTX || 'Tài xế',
        phone: userData.phone || userData.SDT,
        // Include additional fields if they exist
        license: userData.license || userData.giayphep,
        plate: userData.plate || userData.biensoxe,
        busStatus: userData.busStatus || userData.trangthai,
        shiftStart: userData.shiftStart || userData.batdau || 'Chưa phân ca',
        shiftEnd: userData.shiftEnd || userData.ketthuc,
        dayOfWeek: userData.dayOfWeek || userData.ngaytrongtuan,
        routeName: userData.routeName || userData.Tentuyen
      };
      
      console.log('Formatted user data:', formattedUser);
      
      console.log('User data from server:', userData);
      
      // Store token and user data
      await storage.set(AUTH_TOKEN_KEY, token);
      await persistUserData(formattedUser);
      
      // Update state
      setToken(token);
      setApiToken(token);
      setUser(formattedUser);
      
      console.log('Login successful, user:', formattedUser);
      return formattedUser;
      
    } catch (error: any) {
      console.error('Login failed:', error);

      // Clean up on error
      await clearUserData();
      setToken(null);
      setUser(null);
      setApiToken(null);
      
      // Provide user-friendly error message
      let errorMessage = 'Đăng nhập thất bại';
      
      if (error.response) {
        // Handle axios response errors
        const responseData = error.response.data || {};
        errorMessage = responseData.error || 
                      responseData.message || 
                      `Lỗi máy chủ (${error.response.status})`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
      } else if (error.message) {
        // Something happened in setting up the request
        errorMessage = error.message;
      }
      
      console.log('Throwing error:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Clear all auth data
      setToken(null);
      setUser(null);
      setApiToken(null);
      await clearUserData();
      
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(() => ({ 
    token, 
    user, 
    isLoading,
    signIn, 
    signOut 
  }), [token, user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
