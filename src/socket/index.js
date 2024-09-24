import { Server } from 'socket.io';
import chatService from '../services/chatService.js';
import logger from '../../lib/logger.js';
import jwt from 'jsonwebtoken';

export const initializedSocketIO = (server) => {
  const io = new Server(server);
  const userSockets = new Map(); // 사용자 ID와 소켓 ID를 매핑

  // JWT 검증 미들웨어
  // io.use((socket, next) => {
  //   if (socket.handshake.auth && socket.handshake.auth.token) {
  //     jwt.verify(
  //       socket.handshake.auth.token,
  //       process.env.JWT_SECRET,
  //       (err, decoded) => {
  //         if (err) return next(new Error('Authentication error'));
  //         socket.decoded = decoded;
  //         next();
  //       }
  //     );
  //   } else {
  //     next(new Error('Authentication error'));
  //   }
  // });

  io.on('connection', (socket) => {
    logger.info('Socket connection Established', {
      socketId: socket.id,
      // userId: socket.decoded.userId,
    });

    // 소켓 연결 시 사용자 정보 저장
    // const userId = socket.decoded.userId;
    // userSockets.set(userId, socket.id);
    // socket.userId = userId;

    // 채팅방 참여 시
    socket.on('join-chat', async (data) => {
      try {
        // 채팅방 접근 권한 확인
        const params = {
          roomId: data.chatRoomId,
          userId: data.userId,
        };
        const canJoin = await chatService.canJoinChatRoom(params);
        if (canJoin === false) {
          return socket.emit('error', { message: 'Cannot join chat room' });
        } else {
          socket.join(data.chatRoomId);
          socket.chatRoomId = data.chatRoomId;
          logger.info('User join chat room', data.userId, data.chatRoomId);

          // 채팅 참여 알림
          socket.to(data.chatRoomId).emit('user-joined', data.userId);

          // 채팅 데이터 로드
          const chatHistory = await chatService.getChatDetail(data.chatRoomId);
          console.log(chatHistory);
          socket.to(data.chatRoomId).emit('chat-history', chatHistory);
        }
      } catch (error) {
        logger.error(
          'Error joining chat room',
          error,
          data.userId,
          data.chatRoomId
        );
        socket.emit('error', { message: 'Failed to join chat room' });
      }
    });

    // 채팅 전송 시
    socket.on('message-send', async (data) => {
      console.log(data);
      try {
        if (
          !data.message ||
          typeof data.message !== 'string' ||
          data.message.trim().length === 0
        ) {
          return socket.emit('message-error', {
            message: 'Invalid message format',
          });
        }

        // 메세지 저장
        const params = {
          chatRoomId: data.chatRoomId,
          senderId: data.userId,
          message: data.message.trim(),
        };

        await chatService.saveMessage(params);

        // 메시지 전송
        io.to(data.chatRoomId).emit('receive-message', params.message);

        logger.info('Message sent', {
          chatRoomId: data.chatRoomId,
          message: params.message,
        });
      } catch (error) {
        logger.error('Error sending message', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
  });
};
