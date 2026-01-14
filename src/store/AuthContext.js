import React, { createContext, useState, useEffect, useContext } from 'react';
import { StorageService } from '../utils/storage';
import { AuthAPI } from '../api/authApi';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load auth state on mount
  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const storedToken = await StorageService.getToken();
      const storedUser = await StorageService.getUser();
      const onboardingStatus = await StorageService.isOnboardingComplete();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setOnboardingComplete(onboardingStatus);
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await AuthAPI.login(email, password);
      
      await StorageService.saveToken(response.token);
      await StorageService.saveUser(response.user);
      
      setToken(response.token);
      setUser(response.user);
      setOnboardingComplete(false);

      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await AuthAPI.register(email, password, name);
      
      await StorageService.saveToken(response.token);
      await StorageService.saveUser(response.user);
      
      setToken(response.token);
      setUser(response.user);
      setOnboardingComplete(false);

      return response;
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await AuthAPI.verifyOTP(email, otp);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const completeOnboarding = async () => {
    await StorageService.setOnboardingComplete(true);
    setOnboardingComplete(true);
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
      setUser(null);
      setToken(null);
      setOnboardingComplete(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    token,
    onboardingComplete,
    loading,
    login,
    register,
    verifyOTP,
    completeOnboarding,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
