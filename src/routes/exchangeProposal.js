import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const router = express.Router();
import exchangeService from '../services/exchangeProposalService.js';

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'src/uploads/'; // 파일을 저장할 경로

    // 폴더가 존재하는지 확인, 없으면 생성
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // 폴더가 없으면 생성 (하위 디렉토리도 포함하여 생성 가능)
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

//제안 등록
router.post('/register', upload.array('images', 5), async (req, res, next) => {
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
    const images = req.files; // Multer로 받은 이미지 파일들
    //console.log('🚀 ~ router.post ~ images:', images);
    console.log('🚀 ~ router.post ~ params:', params1, params2);

    const result = await exchangeService.register(params1, params2, images);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

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
      contentsId: req.body.contentsId,
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
