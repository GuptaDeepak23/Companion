import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const ONBOARDING_KEY = 'onboarding_complete';

export const StorageService = {
  // Auth Token
  async saveToken(token) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  async getToken() {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async removeToken() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  // User Data
  async saveUser(user) {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getUser() {
    try {
      const userData = await SecureStore.getItemAsync(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async removeUser() {
    try {
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  },

  // Onboarding Status
  async setOnboardingComplete(isComplete) {
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, String(isComplete));
    } catch (error) {
      console.error('Error setting onboarding status:', error);
    }
  },

  async isOnboardingComplete() {
    try {
      const status = await SecureStore.getItemAsync(ONBOARDING_KEY);
      return status === 'true';
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      return false;
    }
  },

  // Clear all data
  async clearAll() {
    try {
      await this.removeToken();
      await this.removeUser();
      await SecureStore.deleteItemAsync(ONBOARDING_KEY);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
