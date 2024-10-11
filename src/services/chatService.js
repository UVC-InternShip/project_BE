import chatDao from '../dao/chatDao.js';
import userDao from '../dao/userDao.js';
import contentsDao from '../dao/contentsDao.js';
import logger from '../../lib/logger.js';

const chatService = {
  async createShareChatRoom(params) {
    try {
      const checkroom = await chatDao.checkExistShareRoom(params);

      if (checkroom) {
        console.log('checkroom', checkroom._id);
        const [sharer, requester, content, roomId] = await Promise.all([
          userDao.getUserInfoById({ userId: checkroom.member[0] }),
          userDao.getUserInfoById({ userId: checkroom.member[1] }),
          contentsDao.getItemById({ itemId: checkroom.itemId }),
        ]);
        return {
          message: 'already exist',
          result: {
            chatroomId: checkroom._id,
            user: [sharer, requester],
            contents: content,
          },
        };
      }

      return await chatDao.createShareChatRoom(params);
    } catch (error) {
      logger.error('createShareChatRoom Error:', error);
      throw error;
    }
  },

  async createExchangeChatRoom(params) {
    try {
      const checkroom = await chatDao.checkExistExchangeRoom(params);
      if (checkroom) {
        const [proposal, writer, proposeContentId, writerContentId] =
          await Promise.all([
            userDao.getUserInfoById({ userId: checkroom.member.proposalId }),
            userDao.getUserInfoById({ userId: checkroom.member.writerId }),
            contentsDao.getItemById({
              itemId: checkroom.itemId.proposeContentId,
            }),
            contentsDao.getItemById({
              itemId: checkroom.itemId.writerContentId,
            }),
          ]);
        return {
          message: 'already exist',
          result: {
            chatroomId: checkroom._id,
            user: [proposal, writer],
            contents: [proposeContentId, writerContentId],
          },
        };
      }
      return await chatDao.createExchangeChatRoom(params);
    } catch (error) {
      logger.error('createExchangeChatRoom Error:', error);
      throw error;
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
