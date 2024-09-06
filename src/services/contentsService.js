const contentsDao = require('../dao/contentsrDao');

const contentsService = {
  //상품 등록
  async register(params) {
    console.log('🚀 ~ reg ~ params:', params);
    let inserted = null;

    try {
      inserted = await contentsDao.insert(params);
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
  async edit() {
    console.log('🚀 ~ usersGet ~ params:');
    let inserted = null;

    try {
      inserted = await contentsDao.allUsers();
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
    let result = null;

    try {
      result = await contentsDao.selectList(params);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },

  //상품 삭제
  async delete(params) {
    let result = null;

    try {
      result = await contentsDao.selectInfo(params);
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
  async listGet(params) {
    let result = null;

    try {
      result = await contentsDao.update(params);
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
      result = await contentsDao.delete(params);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },

  //상품 검색
  async search(params) {
    let result = null;

    try {
      result = await contentsDao.deleteForce(params);
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
  async categoryGet(params) {
    let selectedUserInfo = null;
    try {
      // 1. 사용자 조회 (로그인용)
      selectedUserInfo = await contentsDao.loginUser(params);

      // 1-1. 사용자 조회된게 있는지 확인후 없으면 에러처리 및 함수 종료
      if (!selectedUserInfo) {
        const err = new Error(
          `userService.login, 일치하는 유저정보가 없습니다 (userID: ${JSON.stringify(params.userID)})`
        );
        return new Promise((resolve, reject) => {
          reject(err);
        });
      }
      return new Promise((resolve) => {
        resolve(selectedUserInfo);
      });
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  },
};

module.exports = contentsService;
