import chatDao from '../dao/chatDao.js';
import userDao from '../dao/userDao.js';
import contentsDao from '../dao/contentsDao.js';
import logger from '../../lib/logger.js';

const chatService = {
  async createShareChatRoom(params) {
    try {
      const checkroom = await chatDao.checkExistShareRoom(params);

      if (checkroom) {
        const [sharer, requester, content] = await Promise.all([
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
        // member가 배열인지 객체인지 확인하고 적절히 처리
        const memberIds = Array.isArray(room.member)
          ? room.member
          : room.member.proposalId && room.member.writerId
            ? [room.member.proposalId, room.member.writerId]
            : [];

        const memberPromises = memberIds.map((memberId) =>
          userDao.getUserInfoById({ userId: memberId })
        );

        let items = [];
        if (typeof room.itemId === 'object') {
          // itemId가 객체인 경우 두 개의 컨텐츠를 각각 조회
          const [proposeContent, writerContent] = await Promise.all([
            contentsDao.listContentsGet({
              contentsId: room.itemId.proposeContentId,
            }),
            contentsDao.listContentsGet({
              contentsId: room.itemId.writerContentId,
            }),
          ]);

          // 각 컨텐츠의 첫 번째 항목을 items 배열에 추가
          if (proposeContent && proposeContent.length > 0) {
            items.push({
              id: proposeContent[0].contentsId,
              title: proposeContent[0].title,
              type: proposeContent[0].contentsType,
              purpose: proposeContent[0].purpose,
              status: proposeContent[0].status,
              image:
                proposeContent[0].images && proposeContent[0].images.length > 0
                  ? proposeContent[0].images[0]
                  : null,
              userId: proposeContent[0].userId,
              itemType: 'propose', // 제안 컨텐츠 구분
            });
          }

          if (writerContent && writerContent.length > 0) {
            items.push({
              id: writerContent[0].contentsId,
              title: writerContent[0].title,
              type: writerContent[0].contentsType,
              purpose: writerContent[0].purpose,
              status: writerContent[0].status,
              image:
                writerContent[0].images && writerContent[0].images.length > 0
                  ? writerContent[0].images[0]
                  : null,
              userId: writerContent[0].userId,
              itemType: 'writer', // 작성자 컨텐츠 구분
            });
          }
        } else {
          // 기존 단일 아이템 처리
          const itemResult = await contentsDao.listContentsGet({
            contentsId: room.itemId,
          });
          if (itemResult && itemResult.length > 0) {
            items.push({
              id: itemResult[0].contentsId,
              title: itemResult[0].title,
              type: itemResult[0].contentsType,
              purpose: itemResult[0].purpose,
              status: itemResult[0].status,
              image:
                itemResult[0].images && itemResult[0].images.length > 0
                  ? itemResult[0].images[0]
                  : null,
              userId: itemResult[0].userId,
            });
          }
        }

        const members = await Promise.all(memberPromises);

        return {
          id: room._id.toString(),
          members: members
            .map((member) => {
              if (member && member.dataValues) {
                return {
                  id: member.dataValues.userId,
                  name: member.dataValues.name,
                  profile: member.dataValues.profile,
                };
              }
              return null;
            })
            .filter(Boolean),
          items: items, // item 대신 items 배열 반환
          date: room.date || room.data,
        };
      })
    );

    // items 배열이 비어있지 않은 경우만 필터링
    return result.filter(
      (room) => room.members.length > 0 && room.items.length > 0
    );
  },

  async getChatDetail(params) {
    const result = await chatDao.getDetail(params);

    const chatInfo = result.chatInfo;

    let contentInfo = [];
    const itemId = chatInfo.itemId;

    if (typeof itemId === 'object' && itemId !== null) {
      // 교환의 경우
      const proposalContentId = itemId.proposeContentId;
      const writerContentId = itemId.writerContentId;

      const [proposeContent, writerContent] = await Promise.all([
        proposalContentId
          ? contentsDao.listContentsGet({ contentsId: proposalContentId })
          : null,
        writerContentId
          ? contentsDao.listContentsGet({ contentsId: writerContentId })
          : null,
      ]);

      // 각각의 컨텐츠에 대해 이미지 처리
      const processedProposeContent = proposeContent
        ? proposeContent.map((item) => {
            const { images, ...rest } = item;
            return {
              ...rest,
              firstImage: images && images.length > 0 ? images[0] : null,
            };
          })
        : null;

      const processedWriterContent = writerContent
        ? writerContent.map((item) => {
            const { images, ...rest } = item;
            return {
              ...rest,
              firstImage: images && images.length > 0 ? images[0] : null,
            };
          })
        : null;

      contentInfo = {
        proposeContent: processedProposeContent,
        writerContent: processedWriterContent,
      };
    } else {
      // 나눔의 경우
      const content = await contentsDao.listContentsGet({
        contentsId: itemId,
      });

      contentInfo = content
        ? content.map((item) => {
            const { images, ...rest } = item;
            return {
              ...rest,
              firstImage: images && images.length > 0 ? images[0] : null,
            };
          })
        : [];
    }
    return {
      chatInfo: result.chatInfo,
      contentInfo: contentInfo,
      message: result.message,
    };
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
