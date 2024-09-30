import { getDb } from '../models/mongoModels.js';
import logger from '../../lib/logger.js';
import { ObjectId } from 'mongodb';

const chatDao = {
  async createChatRoom(params) {
    try {
      const db = getDb();
      const result = await db.collection('chatroom').insertOne({
        member: [params.writerId, params.userId],
        itemId: params.itemId,
        date: new Date(),
      });
      return result;
    } catch (error) {
      logger.error('Error in createChatRoom:', error);
      throw error;
    }
  },

  async getChatRooms(params) {
    try {
      const db = getDb();
      const result = await db
        .collection('chatroom')
        .find({
          member: parseInt(params.memberId),
        })
        .sort({ date: -1 })
        .toArray();
      return result;
    } catch (error) {
      logger.error('Error in getChatRooms:', error);
      throw error;
    }
  },

  async checkExistRoom(params) {
    try {
      const db = getDb();
      const result = await db.collection('chatroom').findOne({
        member: [params.writerId, params.userId],
        itemId: params.itemId,
      });
      return result;
    } catch (error) {
      logger.error('Error in checkExistRoom:', error);
      throw error;
    }
  },

  async getDetail(params) {
    try {
      const db = getDb();
      const result = await db.collection('chatroom').findOne({
        _id: new ObjectId(params),
      });
      const result2 = await db
        .collection('chats')
        .find({
          room: new ObjectId(params),
        })
        .toArray();
      const returnResult = {
        chatInfo: result,
        message: result2,
      };
      return returnResult;
    } catch (error) {
      logger.error('Error in getDetail:', error);
      throw error;
    }
  },

  async userCanJoin(params) {
    try {
      const db = getDb();
      const result = await db.collection('chatroom').findOne({
        _id: new ObjectId(params.roomId),
        member: params.userId,
      });
      if (result) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      logger.error('Error userCanJoin', error);
      throw error;
    }
  },

  async saveChatMessage(params) {
    const db = getDb();
    const result = await db.collection('chats').insertOne({
      room: new ObjectId(params.chatRoomId),
      senderId: params.senderId,
      message: params.message,
      timestamp: new Date(),
    });
    console.log(result);
    return result;
  },

  async exitChatRoom(room) {
    const db = getDb();
    const result = await db.collection('chatroom').deleteOne({
      _id: new ObjectId(room),
    });
    return result;
  },
};

export default chatDao;
