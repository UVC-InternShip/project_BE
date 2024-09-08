import User from '../models/users.js';
import logger from '../../lib/logger.js';
import { ValidationError } from 'sequelize';

const userDao = {
  // 회원가입
  async insert(params) {
    console.log(params);
    try {
      const insertInfo = await User.create(params);
      return insertInfo;
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
      });
      return selectOne;
    } catch (error) {
      logger.error('Unexpected error on findOne:', error.message, error.stack);
      throw error;
    }
  },

  // 모든 회원 리스트 리턴 ( role : 'user'인 회원만 정렬을 통해.. )
  async getAllUsers() {
    try {
      const selectAll = await User.findAll({
        where: { role: 'user' },
        order: [['id', 'ASC']],
      });
      return selectAll;
    } catch (error) {
      logger.error('Unexpected error on findAll:', error.message, error.stack);
      throw error;
    }
  },

  // 회원 정보 수정(등록된 이름(닉네임) 변경)
  async updateUserName(params) {
    console.log(params);
    try {
      await User.update(params, {
        where: { id: params.id },
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
};

export default userDao;
