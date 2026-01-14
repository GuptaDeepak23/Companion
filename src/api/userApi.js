// Mock User API
import { MOCK_USERS, MOCK_LOCATIONS } from './mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const UserAPI = {
  async getUsers(filters = {}) {
    await delay(800);
    
    let users = [...MOCK_USERS];

    // Apply filters
    if (filters.city) {
      users = users.filter(u => u.location.city === filters.city);
    }
    if (filters.state) {
      users = users.filter(u => u.location.state === filters.state);
    }
    if (filters.country) {
      users = users.filter(u => u.location.country === filters.country);
    }

    return users;
  },

  async getUserProfile(userId) {
    await delay(500);
    return MOCK_USERS.find(u => u.id === userId) || MOCK_USERS[0];
  },

  async updateProfile(userId, data) {
    await delay(800);
    return {
      success: true,
      user: { ...MOCK_USERS[0], ...data },
    };
  },

  async uploadProfilePhoto(base64Image) {
    await delay(1000);
    return {
      success: true,
      photoUrl: base64Image,
    };
  },

  async uploadKYC(base64Document) {
    await delay(1500);
    return {
      success: true,
      kycStatus: 'pending',
      message: 'KYC document uploaded successfully. Verification pending.',
    };
  },

  async updateInterests(interests) {
    await delay(500);
    return {
      success: true,
      interests: interests,
    };
  },

  async sendInterest(userId) {
    await delay(600);
    return {
      success: true,
      message: 'Interest sent successfully',
    };
  },

  async acceptInterest(userId) {
    await delay(600);
    return {
      success: true,
      message: 'Interest accepted',
    };
  },

  async deleteAccount() {
    await delay(1000);
    return {
      success: true,
      message: 'Account deleted successfully',
    };
  },

  getLocations() {
    return MOCK_LOCATIONS;
  },
};
