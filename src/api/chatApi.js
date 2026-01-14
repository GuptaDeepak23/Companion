// Mock Chat API
import { MOCK_CHATS } from './mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockMessages = {};

export const ChatAPI = {
  async getChats() {
    await delay(600);
    return MOCK_CHATS;
  },

  async getMessages(chatId) {
    await delay(500);
    
    // Return mock messages for this chat
    if (!mockMessages[chatId]) {
      mockMessages[chatId] = [
        {
          id: '1',
          chatId: chatId,
          senderId: chatId === '1' ? '1' : '2',
          text: 'Hi! Nice to meet you',
          timestamp: new Date(Date.now() - 7200000),
          isOwn: false,
        },
        {
          id: '2',
          chatId: chatId,
          senderId: 'me',
          text: 'Hello! Thanks for connecting',
          timestamp: new Date(Date.now() - 3600000),
          isOwn: true,
        },
      ];
    }

    return mockMessages[chatId];
  },

  async sendMessage(chatId, text) {
    await delay(400);

    const newMessage = {
      id: Date.now().toString(),
      chatId: chatId,
      senderId: 'me',
      text: text,
      timestamp: new Date(),
      isOwn: true,
    };

    if (!mockMessages[chatId]) {
      mockMessages[chatId] = [];
    }
    mockMessages[chatId].push(newMessage);

    return newMessage;
  },

  async sendInitialMessage(userId, text) {
    await delay(600);

    const newChatId = 'chat_' + Date.now();
    return {
      success: true,
      chatId: newChatId,
      message: 'Message sent. Waiting for response.',
    };
  },

  async canSendMessage(chatId) {
    await delay(200);
    
    // Mock: Check if interest is accepted
    const chat = MOCK_CHATS.find(c => c.id === chatId);
    return {
      canSend: chat ? chat.interestAccepted : false,
      reason: chat?.interestAccepted ? null : 'Interest not yet accepted',
    };
  },
};
