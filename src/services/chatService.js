import chatDao from '../dao/chatDao.js';
import userDao from '../dao/userDao.js';
import contentsDao from '../dao/contentsDao.js';
import logger from '../../lib/logger.js';

const chatService = {
  async createShareChatRoom(params) {
    const checkroom = await chatDao.checkExistShareRoom(params);
    if (checkroom) {
      // 기존의 채팅방이 있을경우 리턴
      console.log(checkroom);
      // 여기서 이제 넘겨줄 데이터 변환시켜서 넘겨줘야함 ㅇㅇ
      return { message: 'already exist', checkroom };
    } else {
      // 기존의 채팅방이 없을경우 새로운 채팅방 생성
      try {
        const createChatRoom = await chatDao.createShareChatRoom(params);
        return createChatRoom;
      } catch (error) {
        logger.error('createChatRoom Error:', error);
        throw error;
      }
    }
  },

  async createExchangeChatRoom(params) {
    const checkExchangeRoom = await chatDao.checkExistExchangeRoom(params);
    if (checkExchangeRoom) {
      return { message: 'already exist', checkExchangeRoom };
    } else {
      try {
        const createExchangeChatRoom =
          await chatDao.createExchangeChatRoom(params);
        return createExchangeChatRoom;
      } catch (error) {
        logger.error('createExchangeChatRoom Error:', error);
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
    const chatRooms = await chatDao.getChatRooms(params);

    const result = await Promise.all(
      chatRooms.map(async (room) => {
        const memberPromises = room.member.map((memberId) =>
          userDao.getUserInfoById({ userId: memberId })
        );

        const [members, item] = await Promise.all([
          Promise.all(memberPromises),
          contentsDao.getItemById({ itemId: room.itemId }),
        ]);

        return {
          id: room._id.toString(),
          members: members
            .map((member) => {
              if (member && member.dataValues) {
                return {
                  id: member.dataValues.userId,
                  name: member.dataValues.name,
                };
              }
              return null;
            })
            .filter(Boolean),
          item:
            item && item.dataValues
              ? {
                  id: item.dataValues.contentsId,
                  title: item.dataValues.title,
                  type: item.dataValues.contentsType,
                  purpose: item.dataValues.purpose,
                  status: item.dataValues.status,
                }
              : null,
          date: room.date,
        };
      })
    );

    return result.filter((room) => room.members.length > 0 && room.item); // 유효한 데이터만 반환
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
