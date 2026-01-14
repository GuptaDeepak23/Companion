// Mock Auth API
import { StorageService } from '../utils/storage';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const AuthAPI = {
  async login(email, password) {
    await delay(1000);
    
    // Mock validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Mock successful login
    const mockUser = {
      id: 'user_' + Date.now(),
      email: email,
      name: email.split('@')[0],
      onboardingComplete: false,
    };

    const mockToken = 'mock_token_' + Date.now();

    return {
      user: mockUser,
      token: mockToken,
      requiresOTP: true,
    };
  },

  async register(email, password, name) {
    await delay(1000);

    if (!email || !password || !name) {
      throw new Error('All fields are required');
    }

    const mockUser = {
      id: 'user_' + Date.now(),
      email: email,
      name: name,
      onboardingComplete: false,
    };

    const mockToken = 'mock_token_' + Date.now();

    return {
      user: mockUser,
      token: mockToken,
      requiresOTP: true,
    };
  },

  async verifyOTP(email, otp) {
    await delay(1000);

    // Mock: Accept any 6-digit OTP
    if (!otp || otp.length !== 6) {
      throw new Error('Invalid OTP');
    }

    return {
      success: true,
      message: 'OTP verified successfully',
    };
  },

  async resendOTP(email) {
    await delay(500);
    return {
      success: true,
      message: 'OTP sent to your email',
    };
  },

  async logout() {
    await StorageService.clearAll();
    return { success: true };
  },
};
