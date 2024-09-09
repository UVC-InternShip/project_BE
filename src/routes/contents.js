import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const router = express.Router();
import contentsService from '../services/contentsService.js';

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

//상품 등록
router.post('/register', upload.array('images', 5), async (req, res, next) => {
  try {
    const params = {
      user_id: req.body.user_id,
      category_id: req.body.category_id,
      title: req.body.title,
      description: req.body.description,
      content_type: req.body.content_type,
      purpose: req.body.purpose,
      status: req.body.status,
    };
    const images = req.files; // Multer로 받은 이미지 파일들
    //console.log('🚀 ~ router.post ~ images:', images);
    console.log('🚀 ~ router.post ~ params:', params);

    const result = await contentsService.register(params, images);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//상품 수정
router.put('/update', async (req, res, next) => {
  try {
    const updateData = req.body;
    console.log('🚀 ~ router.put ~ params:', updateData);

    const result = await contentsService.edit(updateData);
    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//상품 판매 상태 변경
router.put('/status', async (req, res, next) => {
  try {
    const updateData = req.body;
    console.log('🚀 ~ router.put ~ params:', updateData);

    const result = await contentsService.statusChange(updateData);
    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//상품 삭제
router.delete('/delete/:id', async (req, res, next) => {
  try {
    const contentsId = req.params.id;
    console.log('🚀 ~ router.delete ~ contentsId:', contentsId);

    //console.log('🚀 ~ router.delete ~ params:', params);

    const result = await contentsService.delete(contentsId);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//상품 리스트 불러오기
router.get('/list_all', async (req, res, next) => {
  try {
    const result = await contentsService.listGet();

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//유저별 상품 리스트 가져오기
router.post('/list_user', async (req, res, next) => {
  try {
    const params = {
      id: req.body.id,
    };
    console.log('🚀 ~ router.post ~ params:', params);

    const result = await contentsService.listUserGet(params);
    console.log('🚀 ~ router.post ~ params:', params);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//상품 검색
router.post('/search', async (req, res, next) => {
  try {
    const searchParams = {
      title: req.body.searchName,
    };
    let type;
    if (req.body.searchType == 1) {
      type = 'exchange';
    } else if (req.body.searchType == 2) {
      type = 'sharing';
    }

    console.log('🚀 ~ router.post ~ params:', searchParams);

    const result = await contentsService.search(searchParams, type);
    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//카테고리 가져오기
router.get('/category', async (req, res, next) => {
  try {
    const result = await contentsService.categoryGet();

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//카테고리 추가
router.post('/category', async (req, res, next) => {
  try {
    const params = {
      category_name: req.body.category_name,
    };
    console.log('🚀 ~ router.post ~ params:', params);

    const result = await contentsService.categoryPost(params);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

export default router;
