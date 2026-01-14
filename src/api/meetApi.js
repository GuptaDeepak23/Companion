// Mock Meet API
import { MOCK_MEETS } from './mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let meets = [...MOCK_MEETS];

export const MeetAPI = {
  async createMeet(data) {
    await delay(1000);

    const newMeet = {
      id: 'meet_' + Date.now(),
      userId: data.userId,
      userName: data.userName,
      location: data.location,
      dateTime: data.dateTime,
      duration: data.duration,
      status: 'upcoming',
      createdAt: new Date(),
    };

    meets.push(newMeet);

    return {
      success: true,
      meet: newMeet,
      message: 'Meet scheduled successfully',
    };
  },

  async getMeets(status = 'all') {
    await delay(600);

    if (status === 'all') {
      return meets;
    }

    return meets.filter(m => m.status === status);
  },

  async getMeetById(meetId) {
    await delay(400);
    return meets.find(m => m.id === meetId) || meets[0];
  },

  async cancelMeet(meetId) {
    await delay(800);

    const meetIndex = meets.findIndex(m => m.id === meetId);
    if (meetIndex !== -1) {
      meets[meetIndex].status = 'cancelled';
    }

    return {
      success: true,
      message: 'Meet cancelled successfully',
    };
  },

  async triggerSOS(meetId) {
    await delay(500);

    return {
      success: true,
      message: 'Emergency services notified. Stay safe!',
      sosId: 'sos_' + Date.now(),
    };
  },
};
