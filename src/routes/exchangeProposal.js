import express from 'express';
import imageUploader from './imageUploader.js';
const router = express.Router();
import exchangeService from '../services/exchangeProposalService.js';

//제안 등록
router.post(
  '/register',
  imageUploader.array('images', 5),
  async (req, res, next) => {
    try {
      const params1 = {
        userId: req.body.userId,
        categoryId: req.body.categoryId,
        title: req.body.title,
        description: req.body.description,
        contentsType: req.body.contentsType,
        purpose: req.body.purpose,
      };

      const params2 = {
        proposerUserId: req.body.proposerUserId,
        offererUserId: req.body.offerID,
        proposerContentId: req.body.proposerContentId,
      };

      // req.files에서 S3의 location 필드를 사용하여 이미지 경로 처리
      const images = req.files.map((file) => {
        if (!file.location) {
          throw new Error('S3 파일 업로드 실패'); // S3에 업로드된 파일이 없으면 에러 처리
        }

        return {
          filename: file.key,
          path: file.location, // S3에서 제공하는 파일의 전체 경로
        };
      });

      console.log('🚀 ~ router.post ~ images:', images);
      console.log('🚀 ~ router.post ~ params:', params1, params2);

      const result = await exchangeService.register(params1, params2, images);

      res.status(200).json({ state: 'success', result });
    } catch (error) {
      next(error);
    }
  }
);

//제안 등록_게시판
router.post('/registerContents', async (req, res, next) => {
  try {
    const params = {
      proposerUserId: req.body.proposerUserId,
      offererUserId: req.body.offererUserId,
      proposerContentId: req.body.proposerContentId,
      contentsId: req.body.contentsId,
    };

    console.log('🚀 ~ router.registerContents ~ params:', params);

    const result = await exchangeService.regContents(params);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//제안 리스트 불러오기
router.get('/listAll', async (req, res, next) => {
  try {
    const result = await exchangeService.listGet();

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//유저별 제안 리스트 가져오기
router.post('/userList', async (req, res, next) => {
  try {
    const params = {
      proposerUserId: req.body.userId,
    };
    console.log('🚀 ~ router.post ~ params:', params);

    const result = await exchangeService.listUserGet(params);
    console.log('🚀 ~ router.post ~ params:', params);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//상품별 제안 리스트 가져오기
router.post('/contentsList', async (req, res, next) => {
  try {
    const params = {
      proposerContentId: req.body.proposerContentId,
    };
    console.log('🚀 ~ router.post ~ params:', params);

    const result = await exchangeService.listContentsGet(params);
    console.log('🚀 ~ router.post ~ params:', params);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//제안 삭제
router.delete('/delete/:id', async (req, res, next) => {
  try {
    const proposalId = req.params.id;
    console.log('🚀 ~ router.delete ~ contentsId:', proposalId);

    //console.log('🚀 ~ router.delete ~ params:', params);

    const result = await exchangeService.delete(proposalId);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

export default router;
