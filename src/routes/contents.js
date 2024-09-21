import express from 'express';
import { imageUploader } from './imageUploader.js'; // 중괄호를 사용해서 가져오기
const router = express.Router();
import contentsService from '../services/contentsService.js';

//상품 등록
router.post(
  '/register',
  imageUploader.array('images', 5),
  async (req, res, next) => {
    try {
      const params = {
        userId: req.body.userId,
        categoryId: req.body.categoryId,
        title: req.body.title,
        description: req.body.description,
        contentsType: req.body.contentsType,
        purpose: req.body.purpose,
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
      console.log('🚀 ~ router.post ~ params:', params);

      const result = await contentsService.register(params, images);

      res.status(200).json({ state: 'success', result });
    } catch (error) {
      next(error);
    }
  }
);

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
router.get('/listAll', async (req, res, next) => {
  try {
    console.log('상품_listAll');
    const result = await contentsService.listGet();

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//상품 리스트 불러오기_무한스크롤
router.get('/listAllScroll', async (req, res, next) => {
  try {
    console.log('상품_listAllScroll');
    const page = parseInt(req.query.page) || 1; // 요청받은 페이지 번호, 기본값 1
    const limit = parseInt(req.query.limit) || 10; // 한 페이지에 보여줄 데이터 수, 기본값 10
    const offset = (page - 1) * limit; // 시작점 계산

    const params = {
      page: page,
      limit: limit,
      offset: offset,
    };
    const result = await contentsService.listGetScroll(params);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

// 유저별 상품 리스트 가져오기 (GET 방식)
router.get('/listUser', async (req, res, next) => {
  try {
    const params = {
      userId: req.query.userId, // 쿼리 파라미터로 전달
    };
    console.log('🚀 ~ router.get ~ params:', params);

    const result = await contentsService.listUserGet(params);
    console.log('🚀 ~ router.get ~ result:', result);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

// 번호별 상품 리스트 가져오기 (GET 방식)
router.get('/listContents', async (req, res, next) => {
  try {
    const params = {
      contentsId: req.query.contentsId, // 쿼리 파라미터로 전달
    };
    console.log('🚀 ~ router.get ~ params:', params);

    const result = await contentsService.listContentsGet(params);
    console.log('🚀 ~ router.get ~ result:', result);

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
