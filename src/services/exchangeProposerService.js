import exchangesDao from '../dao/exchangeProposerDao.js';

const exchangesService = {
  //상품 등록
  async register(params1, params2, images) {
    console.log('🚀 ~ register ~ params:', params1);
    let inserted1 = null;
    let inserted2 = null;
    try {
      inserted1 = await exchangesDao.insert1(params1);
      console.log('🚀 ~ register ~ inserted1:', inserted1);

      const contentsId = inserted1.contentsId;
      // inserted2에 추가할 데이터를 구성
      const inserted2Data = {
        ...params2,
        contentsId: `${contentsId}`, // inserted1에서 가져온 contentsId 추가
        // 다른 필요한 필드들도 추가
      };

      inserted2 = await exchangesDao.insert2(inserted2Data); //제안등록

      // 2. 이미지 파일 경로를 저장
      if (images && images.length > 0) {
        const imagePaths = images.map((file, index) => ({
          contentsId: contentsId,
          imageUrl: file.path, // 파일 경로
          order: index + 1, // 이미지 순서
        }));
        console.log('🚀 ~ imagePaths ~ imagePaths:', imagePaths);

        // 이미지 경로들을 등록
        await exchangesDao.insertContentImages(imagePaths);
      }
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(inserted1, inserted2);
    });
  },

  //상품 등록_게시판
  async regContents(params) {
    console.log('🚀 ~ register ~ params:', params);
    let inserted = null;
    try {
      inserted = await exchangesDao.insert2(params);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    return new Promise((resolve) => {
      resolve(inserted);
    });
  },

  //제안 삭제
  async delete(params) {
    let result = null;

    try {
      result = await exchangesDao.delete(params);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },

  //제안 리스트 가져오기
  async listGet() {
    let result = null;

    try {
      result = await exchangesDao.listGet();
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },

  //유저별 제안 리스트 가져오기
  async listUserGet(params) {
    let result = null;

    try {
      result = await exchangesDao.listUserGet(params);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },

  //상품별 제안 리스트 가져오기
  async listContentsGet(params) {
    let result = null;

    try {
      result = await exchangesDao.listContentsGet(params);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },
};

export default exchangesService;
