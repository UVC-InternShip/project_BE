import express from 'express';
import contentsService from '../services/contentsService.js';

const router = express.Router();

//상품 등록
router.post('/register', async (req, res, next) => {
  console.log(req.body);
  try {
    const params = {
      title: req.body.title,
      description: req.body.description,
      content_type: req.body.contentType,
      purpose: req.body.purpose,
    };

    const result = await contentsService.register(params);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//상품 수정
router.put('/update', async (req, res, next) => {
  try {
    const params = {
      title: req.query.ids ? req.query.ids.split(',') : null,
      description: req.query.name,
      content_type: req.query.userID,
      purpose: req.query.email,
      status: req.query.phone,
    };

    const result = await contentsService.edit(params);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//상품 판매 상태 변경
router.put('/status', async (req, res, next) => {
  try {
    const params = {
      title: req.query.ids ? req.query.ids.split(',') : null,
      description: req.query.name,
      content_type: req.query.userID,
      purpose: req.query.email,
      status: req.query.phone,
    };

    const result = await contentsService.statusChange(params);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//상품 삭제
router.delete('/delete/:contents_id', async (req, res, next) => {
  try {
    const contentsId = req.params.contents_id;

    const result = await contentsService.delete(contentsId);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//상품 리스트 불러오기
router.post('/list_all', async (req, res, next) => {
  try {
    const params = {
      title: req.query.ids ? req.query.ids.split(',') : null,
      description: req.query.name,
      content_type: req.query.userID,
      purpose: req.query.email,
      status: req.query.phone,
    };

    const result = await contentsService.update(params);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//유저별 상품 리스트 가져오기
router.post('/list_user', async (req, res, next) => {
  try {
    const params = {
      title: req.query.ids ? req.query.ids.split(',') : null,
      description: req.query.name,
      content_type: req.query.userID,
      purpose: req.query.email,
      status: req.query.phone,
    };

    const result = await contentsService.list(params);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//상품 검색
router.post('/search', async (req, res, next) => {
  try {
    const params = {
      title: req.query.ids ? req.query.ids.split(',') : null,
      description: req.query.name,
      content_type: req.query.userID,
      purpose: req.query.email,
      status: req.query.phone,
    };

    const result = await contentsService.list(params);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

//카테고리 가져오기
router.post('/category', async (req, res, next) => {
  try {
    const params = {
      title: req.query.ids ? req.query.ids.split(',') : null,
      description: req.query.name,
      content_type: req.query.userID,
      purpose: req.query.email,
      status: req.query.phone,
    };

    const result = await contentsService.list(params);

    res.status(200).json({ state: 'success', result });
  } catch (error) {
    next(error);
  }
});

export default router;
