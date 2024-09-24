import chatDao from '../dao/chatDao.js';
import logger from '../../lib/logger.js';

const chatService = {
  async createChatRoom(params) {
    const checkroom = await chatDao.checkExistRoom(params);
    if (checkroom) {
      // 기존의 채팅방이 있을경우 리턴
      return { message: 'already exist', checkroom };
    } else {
      // 기존의 채팅방이 없을경우 새로운 채팅방 생성
      try {
        const createChatRoom = await chatDao.createChatRoom(params);
        return createChatRoom;
      } catch (error) {
        logger.error('createChatRoom Error:', error);
        throw error;
      }
    }
  },

  async checkExistRooms(params) {
    console.log(params);
    const checkrooms = await chatDao.checkExistRoom(params);
    return checkrooms;
  },

  async canJoinChatRoom(params) {
    const canJoin = await chatDao.userCanJoin(params);
    return canJoin;
  },

  async getAllChatRooms(params) {
    const result = await chatDao.getChatRooms(params);
    return result;
  },

  async getChatDetail(params) {
    const result = await chatDao.getDetail(params);
    return result;
  },

  async saveMessage(params) {
    const result = await chatDao.saveChatMessage(params);
    return result;
  },

  async exitRoom(room) {
    const result = await chatDao.exitChatRoom(room);
    return result;
  },
};

export default chatService;
