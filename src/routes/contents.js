import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const router = express.Router();
import contentsService from '../services/contentsService.js';

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve('D:/image'); // 파일을 저장할 절대 경로

    // 폴더가 존재하는지 확인, 없으면 생성
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // 폴더가 없으면 생성 (하위 디렉토리도 포함하여 생성 가능)
    }

    cb(null, uploadPath); // 업로드 경로 설정
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
      userId: req.body.userId,
      categoryId: req.body.categoryId,
      title: req.body.title,
      description: req.body.description,
      contentsType: req.body.contentsType,
      purpose: req.body.purpose,
    };

    // title과 description의 빈값 또는 null 체크
    if (!params.title || params.title.trim() === '') {
      return res.status(400).json({
        state: 'error',
        message: '제목을 입력해 주세요.',
      });
    }

    if (!params.description || params.description.trim() === '') {
      return res.status(400).json({
        state: 'error',
        message: '설명을 입력해 주세요.',
      });
    }

    const images = req.files.map((file) => {
      // Windows 형식으로 경로 변환
      const windowsPath = file.path.replace(/\//g, '\\');
      return {
        filename: file.filename,
        path: windowsPath, // Windows 경로 형식으로 저장
      };
    });
    console.log('🚀 ~ router.post ~ images:', images);
    console.log('🚀 ~ router.post ~ params:', params);

    const result = await contentsService.register(params, images);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      // 외래키 제약 조건 위반일 경우
      return res.status(400).json({
        state: 'error',
        message: '잘못된 외래키 값입니다. 올바른 데이터를 입력해 주세요.',
      });
    }

    // 기타 서버 오류 처리
    res.status(500).json({
      state: 'error',
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    });
  }
});

//상품 수정
router.put('/update', async (req, res, next) => {
  try {
    const updateData = {
      contentsId: req.body.contentsId,
      title: req.body.title,
      description: req.body.description,
    };

    console.log('🚀 ~ router.put ~ params:', updateData);

    // title과 description의 빈값 또는 null 체크
    if (!updateData.title || updateData.title.trim() === '') {
      return res.status(400).json({
        state: 'error',
        message: '제목을 입력해 주세요.',
      });
    }

    if (!updateData.description || updateData.description.trim() === '') {
      return res.status(400).json({
        state: 'error',
        message: '설명을 입력해 주세요.',
      });
    }

    const result = await contentsService.edit(updateData);
    res.status(200).json({ state: 'success', result });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      // 외래키 제약 조건 위반일 경우
      return res.status(400).json({
        state: 'error',
        message: '잘못된 외래키 값입니다. 올바른 데이터를 입력해 주세요.',
      });
    }

    // 기타 서버 오류 처리
    res.status(500).json({
      state: 'error',
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    });
  }
});

//상품 판매 상태 변경
router.put('/status', async (req, res, next) => {
  try {
    const updateData = req.body;
    console.log('🚀 ~ router.put ~ params:', updateData);
    // title과 description의 빈값 또는 null 체크
    if (!updateData.title || updateData.title.trim() === '') {
      return res.status(400).json({
        state: 'error',
        message: '제목을 입력해 주세요.',
      });
    }

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
router.get('/listAll', async (req, res, next) => {
  try {
    console.log('상품_listAll');
    const result = await contentsService.listGet();

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//유저별 상품 리스트 가져오기
router.post('/listUser', async (req, res, next) => {
  try {
    const params = {
      userId: req.body.userId,
    };
    console.log('🚀 ~ router.post ~ params:', params);

    const result = await contentsService.listUserGet(params);
    console.log('🚀 ~ router.post ~ params:', params);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//번호별 상품 리스트 가져오기
router.post('/listContents', async (req, res, next) => {
  try {
    const params = {
      contentsId: req.body.contentsId,
    };
    console.log('🚀 ~ router.post ~ params:', params);

    const result = await contentsService.listContentsGet(params);
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
      purpose: req.body.purpose,
    };

    console.log('🚀 ~ router.post ~ params:', searchParams);

    const result = await contentsService.search(searchParams);
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
      categoryName: req.body.categoryName,
    };
    console.log('🚀 ~ router.post ~ params:', params);

    const result = await contentsService.categoryPost(params);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

export default router;
