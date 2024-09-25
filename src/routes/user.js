import express from 'express';
import logger from '../../lib/logger.js';
import userService from '../services/userService.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const params = {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
    };
    const result = await userService.createUser(params);
    if (result.success) {
      res.status(200).json({
        message: '회원가입 성공 및 로그인 되었습니다.',
        user: result.newUser,
        contents: result.contentsList,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } else {
      res.status(400).json({ message: '회원가입 실패', error: result.error });
    }
  } catch (error) {
    logger.error('routes.register_ERROR');
    res.status(500).json(error);
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
    const params = {
      userId: req.params.id,
    };
    const result = await userService.getUserInfo(params);
    res.status(200).json(result);
  } catch (error) {
    logger.error('userRoute.getProfile error:', error.message, error.stack);
    res.status(500).json(error);
  }
});

router.get('/all-users', async (req, res) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json(result);
  } catch (error) {
    logger.error(
      'userRoute.getAllUsersInfo error:',
      error.message,
      error.stack
    );
    res.status(500).json(error);
  }
});

router.put('/update-name/:id', async (req, res) => {
  try {
    const params = {
      id: req.params.id,
      name: req.body.newName,
    };
    const result = await userService.updateUserName(params);
    if (result == true) {
      res.status(200).json('update success');
    }
  } catch (error) {
    logger.error('userRoute.updateName error:', error.message, error.stack);
    res.status(500).json(error);
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const params = {
      id: req.params.id,
    };
    const result = await userService.deleteUser(params);
    if (result == true) {
      res.status(200).json('delete success');
    }
  } catch (error) {
    logger.error('userRoute.deleteUser error:', error.message, error.stack);
    res.status(500).json(error);
  }
});

export default router;
