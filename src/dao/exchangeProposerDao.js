// sequelize와 User 모델 불러오기
import Contents from '../models/contents.js';
import ContentsImg from '../models/contentsImg.js';
import exchangeProposer from '../models/exchangeProposal.js';

const ExchangesDao = {
  // 상품 등록1
  async insert1(params1) {
    //console.log('🚀 ~ insert1 ~ params1:', params1);
    // eslint-disable-next-line no-useless-catch
    try {
      const inserted = await Contents.create(params1);
      //console.log('🚀 ~ ExchangesDao.create ~ inserted:', inserted);
      return inserted;
    } catch (err) {
      throw err;
    }
  },

  // 제안 등록
  async insert2(params2) {
    console.log('🚀 ~ insert2 ~ params2:', params2);
    // eslint-disable-next-line no-useless-catch
    try {
      const exchangeInserted = await exchangeProposer.create(params2);
      console.log('🚀 ~ ExchangesDao.create ~ inserted:', exchangeInserted);
      return exchangeInserted;
    } catch (err) {
      throw err;
    }
  },

  // 이미지 경로 등록
  async insertContentImages(imagePaths) {
    console.log('🚀 ~ insertContentImages ~ imagePaths:', imagePaths);
    // eslint-disable-next-line no-useless-catch
    try {
      const newImages = await ContentsImg.bulkCreate(imagePaths);
      return newImages;
    } catch (error) {
      throw error;
    }
  },

  // 제안 삭제
  async delete(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      const deleted = await exchangeProposer.destroy({
        where: { proposalId: params },
      });
      return deleted;
    } catch (err) {
      throw err;
    }
  },

  // 제안 리스트 가져오기
  async listGet() {
    // eslint-disable-next-line no-useless-catch
    try {
      const listInfo = await exchangeProposer.findAll();

      return listInfo;
    } catch (err) {
      throw err;
    }
  },

  // 유저별 제안 리스트 가져오기
  async listUserGet(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      const selectedInfo = await exchangeProposer.findAll({
        where: { proposerUserId: params.proposerUserId },
      });
      console.log('🚀 ~ listUserGet ~ selectedInfo:', selectedInfo);

      // 1. 모든 상품의 contentsId 가져오기
      const contentsIds = selectedInfo.map(
        (content) => content.dataValues.contentsId
      );
      // 2. 상품의 타이틀 조회
      const contents = await Contents.findAll({
        where: { contentsId: contentsIds },
        attributes: ['contentsId', 'title'], // 필요한 필드만 선택
      });
      console.log('🚀 ~ listContentsGet ~ contents:', contents);

      // 3. 각 상품별로 첫 번째 이미지 정보 조회
      const images = await Promise.all(
        contentsIds.map(async (contentsId) => {
          const image = await ContentsImg.findOne({
            where: { contentsId }, // 각 상품별로 첫 번째 이미지 조회
            attributes: ['contentsId', 'imageUrl', 'order'], // 필요한 필드만 선택
            order: [['order', 'ASC']], // 순서를 기준으로 첫 번째 이미지 가져오기
          });
          return image
            ? { contentsId, imageUrl: image.imageUrl, order: image.order }
            : null;
        })
      );
      // 4. 이미지 데이터를 contentsId를 기준으로 매핑
      const imagesByContentId = images.reduce((acc, image) => {
        if (!acc[image.contentsId]) {
          acc[image.contentsId] = [];
        }
        acc[image.contentsId].push({
          imageUrl: image.imageUrl,
          order: image.order,
        });
        return acc;
      }, {});

      // 5. 상품 정보에 이미지와 타이틀을 포함하여 매핑
      const result = selectedInfo.map((info) => {
        const contentId = info.dataValues.contentsId;
        const content = contents.find((c) => c.contentsId === contentId);

        return {
          ...info.dataValues, // 원래의 selectedInfo 데이터
          title: content ? content.title : null, // 상품의 타이틀 추가
          images: imagesByContentId[contentId] || [], // 해당 상품의 이미지가 있으면 추가
        };
      });

      console.log('🚀 ~ listContentsGet ~ result:', result);
      return result;
    } catch (err) {
      throw err;
    }
  },

  // 상품별 제안 리스트 가져오기
  async listContentsGet(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      const selectedInfo = await exchangeProposer.findAll({
        where: { proposerContentId: params.proposerContentId },
      });
      console.log('🚀 ~ listContentsGet ~ selectedInfo:', selectedInfo);

      // 1. 모든 상품의 contentsId 가져오기
      const contentsIds = selectedInfo.map(
        (content) => content.dataValues.contentsId
      );

      // 2. 상품의 타이틀 조회
      const contents = await Contents.findAll({
        where: { contentsId: contentsIds },
        attributes: ['contentsId', 'title'], // 필요한 필드만 선택
      });
      console.log('🚀 ~ listContentsGet ~ contents:', contents);

      // 3. 각 상품별로 첫 번째 이미지 정보 조회
      const images = await Promise.all(
        contentsIds.map(async (contentsId) => {
          const image = await ContentsImg.findOne({
            where: { contentsId }, // 각 상품별로 첫 번째 이미지 조회
            attributes: ['contentsId', 'imageUrl', 'order'], // 필요한 필드만 선택
            order: [['order', 'ASC']], // 순서를 기준으로 첫 번째 이미지 가져오기
          });
          return image
            ? { contentsId, imageUrl: image.imageUrl, order: image.order }
            : null;
        })
      );
      // 4. 이미지 데이터를 contentsId를 기준으로 매핑
      const imagesByContentId = images.reduce((acc, image) => {
        if (!acc[image.contentsId]) {
          acc[image.contentsId] = [];
        }
        acc[image.contentsId].push({
          imageUrl: image.imageUrl,
          order: image.order,
        });
        return acc;
      }, {});

      // 5. 상품 정보에 이미지와 타이틀을 포함하여 매핑
      const result = selectedInfo.map((info) => {
        const contentId = info.dataValues.contentsId;
        const content = contents.find((c) => c.contentsId === contentId);

        return {
          ...info.dataValues, // 원래의 selectedInfo 데이터
          title: content ? content.title : null, // 상품의 타이틀 추가
          images: imagesByContentId[contentId] || [], // 해당 상품의 이미지가 있으면 추가
        };
      });

      console.log('🚀 ~ listContentsGet ~ result:', result);
      return result;
    } catch (err) {
      throw err;
    }
  },

  // 완전 삭제
  async deleteForce(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      const deleted = await Contents.destroy({
        where: { id: params.id },
        force: true,
      });
      return { deletedCount: deleted };
    } catch (err) {
      throw err;
    }
  },
};

export default ExchangesDao;
