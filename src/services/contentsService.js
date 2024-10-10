import logger from '../../lib/logger.js';
import contentsDao from '../dao/contentsDao.js';
import transaction from '../dao/transactionDao.js';
import { deleteImagesByContentId } from '../routes/imageUploader.js';

const contentsService = {
  //상품 등록
  async register(params, images) {
    console.log('🚀 ~ register ~ params:', params);
    let inserted = null;
    try {
      inserted = await contentsDao.insert(params);

      // 2. 이미지 파일 경로를 저장
      if (images && images.length > 0) {
        const imagePaths = images.map((file, index) => ({
          contentsId: inserted.contentsId,
          imageUrl: file.path, // 파일 경로
          order: index + 1, // 이미지 순서
        }));
        console.log('🚀 ~ imagePaths ~ imagePaths:', imagePaths);

        // 이미지 경로들을 등록
        await contentsDao.insertContentImages(imagePaths);
      }
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(inserted);
    });
  },

  //상품 수정
  async edit(params) {
    let inserted = null;
    try {
      inserted = await contentsDao.update(params);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(inserted);
    });
  },

  //상품 판매 상태 변경
  async statusChange(params) {
    try {
      const result = await contentsDao.updateStatus(params);
      return result;
    } catch (err) {
      logger.error('statusChange error:', err);
      throw err;
    }
  },

  // 상품 상태 완료 시
  async statusDone(params) {
    try {
      const updateParams = {
        contentsId: params.contentsId,
        status: params.status,
      };
      const updateStatus = await contentsDao.updateStatus(updateParams);
      if (updateStatus.status === '완료') {
        const insertTransactions = await transaction.insert(params);
        console.log(insertTransactions);
        return insertTransactions;
      }
    } catch (error) {
      logger.error('statusDone service error:', error);
      throw error;
    }
  },

  //상품 삭제
  async delete(params) {
    let result = null;
    let imgResult = null;

    try {
      result = await contentsDao.delete(params);
      console.log('🚀 ~ delete ~ result:', result);
      if (result == 1) {
        imgResult = await deleteImagesByContentId(params);
        console.log('🚀 ~ delete ~ imgResult:', imgResult);
      }
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },

  //상품 리스트 가져오기
  async listGet() {
    let result = null;

    try {
      result = await contentsDao.listGet();
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },

  //상품 리스트 가져오기
  async listGetScroll(params) {
    let result = null;

    try {
      result = await contentsDao.listGetScroll(params);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },

  //유저별 상품 리스트 가져오기
  async listUserGet(params) {
    let result = null;

    try {
      result = await contentsDao.listUserGet(params);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },

  //유저별 상품 리스트 가져오기
  async listUserGetScroll(params) {
    let result = null;

    try {
      result = await contentsDao.listUserGetScroll(params);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },

  //번호저별 상품 리스트 가져오기
  async listContentsGet(params) {
    let result = null;

    try {
      result = await contentsDao.listContentsGet(params);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },

  //카테고리 가져오기
  async categoryGet() {
    let category = null;
    try {
      // 1. 사용자 조회 (로그인용)
      category = await contentsDao.categoryGet();

      return new Promise((resolve) => {
        resolve(category);
      });
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  },

  //카테고리 추가
  async categoryPost(params) {
    let category = null;
    try {
      // 1. 사용자 조회 (로그인용)
      category = await contentsDao.categoryPost(params);

      return new Promise((resolve) => {
        resolve(category);
      });
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  },
};

export default contentsService;
