// Mock data for frontend development

export const MOCK_USERS = [
  {
    id: '1',
    name: 'Sarah Kumar',
    age: 26,
    gender: 'Female',
    location: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    interests: ['Music', 'Travel', 'Food'],
    profilePhoto: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    kycStatus: 'verified',
  },
  {
    id: '2',
    name: 'Rahul Sharma',
    age: 29,
    gender: 'Male',
    location: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    interests: ['Sports', 'Movies', 'Technology'],
    profilePhoto: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    kycStatus: 'verified',
  },
  {
    id: '3',
    name: 'Priya Patel',
    age: 24,
    gender: 'Female',
    location: { country: 'India', state: 'Gujarat', city: 'Ahmedabad' },
    interests: ['Art', 'Reading', 'Yoga'],
    profilePhoto: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    kycStatus: 'verified',
  },
];

export const MOCK_INTERESTS = [
  'Music', 'Movies', 'Travel', 'Food', 'Sports', 'Technology',
  'Art', 'Reading', 'Yoga', 'Photography', 'Gaming', 'Cooking',
  'Dancing', 'Writing', 'Fitness', 'Nature', 'Fashion', 'Business'
];

export const MOCK_LOCATIONS = {
  India: {
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
    Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
    Karnataka: ['Bangalore', 'Mysore', 'Mangalore'],
    Delhi: ['New Delhi', 'South Delhi', 'North Delhi'],
  },
};

export const MOCK_CHATS = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Kumar',
    lastMessage: 'Hi! Would love to meet for coffee',
    timestamp: new Date(Date.now() - 3600000),
    interestAccepted: true,
    unreadCount: 2,
  },
  {
    id: '2',
    userId: '2',
    userName: 'Rahul Sharma',
    lastMessage: 'Thanks for accepting!',
    timestamp: new Date(Date.now() - 7200000),
    interestAccepted: true,
    unreadCount: 0,
  },
];

export const MOCK_MEETS = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Kumar',
    location: { lat: 19.0760, lng: 72.8777, address: 'Cafe Coffee Day, Bandra West, Mumbai' },
    dateTime: new Date(Date.now() + 86400000),
    duration: 2,
    status: 'upcoming',
  },
];
