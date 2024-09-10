import userDao from '../dao/userDao.js';
import logger from '../../lib/logger.js';

const userService = {
  async createUser(params) {
    try {
      const insert = await userDao.insert(params);
      return insert;
    } catch (error) {
      logger.error('userService.createUser_ERROR', error.message);
      throw error;
    }
  },
  async getUserInfo(params) {
    try {
      const getUserInfo = await userDao.getUserById(params);
      return getUserInfo;
    } catch (error) {
      logger.error(
        'userService.getUserInfo error:',
        error.message,
        error.stack
      );
      throw error;
    }
  },
  async getAllUsers() {
    try {
      const selectAll = await userDao.getAllUsers();
      return selectAll;
    } catch (error) {
      logger.error(
        'userService.getAllUsers error:',
        error.message,
        error.stack
      );
      throw error;
    }
  },
  async updateUserName(params) {
    try {
      const update = await userDao.updateUserName(params);
      return update;
    } catch (error) {
      logger.error(
        'userService.updateUserName error',
        error.message,
        error.stack
      );
      throw error;
    }
  },

  async updateEmail(params) {
    try {
      const updateEmail = await userDao.updateEmail(params);
      return updateEmail;
    } catch (error) {
      logger.error(
        'userService.updateEmail error:',
        error.message,
        error.stack
      );
      throw error;
    }
  },

  async deleteUser(params) {
    try {
      const deleteUser = await userDao.deleteUser(params);
      return deleteUser;
    } catch (error) {
      logger.error('userService.deleteUser error:', error.message, error.stack);
      throw error;
    }
  },

  async checkUser(phoneNumber) {
    try {
      const checkUser = await userDao.getUserPhoneNumber(phoneNumber);
      return checkUser;
    } catch (error) {
      logger.error('userService.checkUser error:', error.message, error.stack);
      throw error;
    }
  },
};

export default userService;
