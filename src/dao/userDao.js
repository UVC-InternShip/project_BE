import User from '../models/user.js';
import Point from '../models/point.js';
import logger from '../../lib/logger.js';
import { ValidationError } from 'sequelize';

const userDao = {
  // 회원가입
  async insert(params) {
    try {
      const newUser = await User.create(params);
      return { success: true, newUser };
    } catch (error) {
      if (error instanceof ValidationError) {
        logger.warn('Validation error on insert:', error.message);
        throw new Error('Validation Error: Invalid user data');
      } else {
        logger.error('Unexpected error on insert:', error.message, error.stack);
        throw error;
      }
    }
  },

  // 회원 한명의 정보 리턴
  async getUserById(params) {
    try {
      const selectOne = await User.findOne({
        where: { userId: params.userId },
        include: [
          {
            model: Point,
            as: 'point',
            attributes: ['pointEarned'],
            required: false,
          },
        ],
      });
      // 사용자 못찾을경우
      if (!selectOne) {
        return null;
      }
      // point null일 경우 0으로 변환해서 보냄
      const pointEarned = selectOne.point ? selectOne.point.pointEarned : 0;

      // 필요한 데이터만 포함하는 새 객체 생성
      const userData = {
        ...selectOne.get({ plain: true }), // Sequelize 인스턴스를 일반 객체로 변환
        pointEarned: pointEarned,
      };

      return userData;
    } catch (error) {
      logger.error('Unexpected error on findOne:', error.message, error.stack);
      throw error;
    }
  },

  // 채팅방에 속한 회원의 ID로 정보 리턴
  async getUserInfoById(params) {
    try {
      const result = await User.findOne({
        where: { userId: params.userId },
        attributes: [
          'userId',
          'phoneNumber',
          'name',
          'reputationScore',
          'profile',
        ],
      });
      return result;
    } catch (error) {
      logger.error(
        'getUserInfoById error on findOne:',
        error.message,
        error.stack
      );
      throw error;
    }
  },

  // 모든 회원 리스트 리턴 ( role : 'user'인 회원만 정렬을 통해.. )
  async getAllUsers() {
    try {
      const selectAll = await User.findAll({
        where: { role: 'user' },
        order: [['userId', 'ASC']],
      });
      return selectAll;
    } catch (error) {
      logger.error('Unexpected error on findAll:', error.message, error.stack);
      throw error;
    }
  },

  // 전화번호 유무 확인
  async getUserPhoneNumber(phoneNumber) {
    try {
      const isUser = await User.findOne({
        where: { phoneNumber: phoneNumber },
      });
      if (isUser) {
        // 유저 존재 시
        return isUser;
      }
      return false;
    } catch (error) {
      logger.error(
        'getUserPhoneNumber error on findOne:',
        error.message,
        error.stack
      );
      throw error;
    }
  },

  // 회원 정보 수정(등록된 이름(닉네임) 변경)
  async updateUserName(params) {
    console.log(params);
    try {
      await User.update(params, {
        where: { userId: params.id },
      });
      return true;
    } catch (error) {
      logger.error(
        'updateUserName error on update:',
        error.message,
        error.stack
      );
      throw error;
    }
  },

  // 이메일 등록
  async updateEmail(params) {
    try {
      const updateUserEmail = await User.update(params, {
        where: { email: params.email },
      });
      return updateUserEmail;
    } catch (error) {
      logger.error(
        'updateUserEmail error on update:',
        error.message,
        error.stack
      );
      throw error;
    }
  },

  // 회원 탈퇴
  async deleteUser(params) {
    try {
      const deleteUser = await User.destroy({
        where: { userId: params.id },
      });
      return deleteUser;
    } catch (error) {
      logger.error('deleteUser error on delete:', error.message, error.stack);
      throw error;
    }
  },

  //평판 점수 증감
  async updateUserReputation(params) {
    console.log(params);
    try {
      const user = await User.update(params, {
        where: { userId: params.userId },
      });
      return user;
    } catch (error) {
      logger.error('reputation error on update:', error);
      throw error;
    }
  },

  async getMemberInfo(params) {
    try {
      const members = await User.findAll({
        where: {
          userId: [params.userId, params.writerId],
        },
        attributes: ['userId', 'name'],
      });
      return members;
    } catch (error) {
      logger.error('find member error:', error);
      throw error;
    }
  },
};

export default userDao;
