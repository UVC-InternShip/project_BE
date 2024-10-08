import express from 'express';
import logger from '../../lib/logger.js';
import chatService from '../services/chatService.js';

const router = express.Router();

// (나눔) 채팅방 생성 새로운 채팅방에서 채팅 전송 시 socket과 http 요청을 동시에 요청
router.post('/share/create', async (req, res) => {
  try {
    const params = {
      userId: req.body.userId, // 나눔을 받기위해 채팅을 전송하는 유저 ID
      writerId: req.body.writerId, // 나눔글을 등록한 유저 ID
      itemId: req.body.itemId, // 나눔글 ID
    };
    const chatId = await chatService.createShareChatRoom(params);
    if (chatId.message === 'already exist') {
      // 이미 유저끼리 같은 상품으로 등록된 채팅방이 존재한다면, 기존의 채팅방 정보를 리턴
      res.status(200).json(chatId);
    } else {
      res.status(200).json({ message: 'success', chatRoomId: chatId });
    }
  } catch (error) {
    logger.error('chatRoute.createChatRoom Error:', error);
    res.status(500).json({ message: 'create ChatRoom Error' });
  }
});

// (교환) 채팅방 생성
router.post('/exchange/create', async (req, res) => {
  try {
    const params = {
      offerId: req.body.offerId, // 교환 제안자
      writerId: req.body.writerId, // 글쓴이
      offerItemId: req.body.offerItemId, // 제안한 사람이 등록한 아이템의 아이디
      writerItemId: req.body.writerItemId, // 글쓴이의 상품 아이디
    };
    const chatId = await chatService.createExchangeChatRoom(params);
    if (chatId.message === 'already exist') {
      // 이미 유저끼리 같은 상품으로 등록된 채팅방이 존재한다면, 기존의 채팅방 정보를 리턴
      res.status(200).json(chatId);
    } else {
      res.status(200).json({ message: 'success', chatRoomId: chatId });
    }
  } catch (error) {
    logger.error('chatRoute.createChatRoom Error:', error);
    res.status(500).json({ message: 'create ChatRoom Error' });
  }
});

// 채팅방 목록 불러오기
router.get('/list', async (req, res) => {
  try {
    const params = {
      memberId: req.body.userId,
    };
    const chatRooms = await chatService.getAllChatRooms(params);
    res.status(200).json({ message: 'success', chatRooms: chatRooms });
  } catch (error) {
    logger.error('chatRoute.getChatRooms Error:', error);
    res.status(500).json({ message: 'get chatRooms Error' });
  }
});

// 채팅 상세 내용 보여주기 채팅방 정보 + 채팅 내용
router.get('/detail/:room', async (req, res) => {
  // 로그인한 회원 조회 권한 확인 예외 추가
  try {
    const chatDetail = await chatService.getChatDetail(req.params.room);
    res.status(200).json({ message: 'success', chatDetail: chatDetail });
  } catch (error) {
    logger.error('chatRoute.getChatRoomDetail Error:', error);
    res.status(500).json({ message: 'get chatRooms Detail Error' });
  }
});

// 채팅방 나가기(삭제)
router.delete('/delete/:room', async (req, res) => {
  try {
    console.log(req.params.room);
    const result = await chatService.exitRoom(req.params.room);
    console.log(result);
    res.status(200).json({ message: 'success' });
  } catch (error) {
    logger.error('roomExit Error:', error);
    res.status(500).json({ message: 'exit room Error' });
  }
});

export default router;