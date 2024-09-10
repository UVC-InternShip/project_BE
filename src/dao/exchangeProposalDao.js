// sequelize와 User 모델 불러오기
import Contents from '../models/contents.js';
import ContentsImg from '../models/contentsImg.js';
import ExchangeProposal from '../models/exchangeProposal.js';

const ExchangesDao = {
  // 상품 등록1
  async insert1(params1) {
    console.log('🚀 ~ insert1 ~ params1:', params1);
    // eslint-disable-next-line no-useless-catch
    try {
      const inserted = await Contents.create(params1);
      console.log('🚀 ~ ExchangesDao.create ~ inserted:', inserted);
      return inserted;
    } catch (err) {
      throw err;
    }
  },

  // 상품 등록2
  async insert2(params2) {
    console.log('🚀 ~ insert2 ~ params2:', params2);
    // eslint-disable-next-line no-useless-catch
    try {
      const exchangeInserted = await ExchangeProposal.create(params2);
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
      const deleted = await ExchangeProposal.destroy({
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
      const listInfo = await ExchangeProposal.findAll();

      return listInfo;
    } catch (err) {
      throw err;
    }
  },

  // 유저별 제안 리스트 가져오기
  async listUserGet(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      const selectedInfo = await ExchangeProposal.findAll({
        where: { proposerUserId: params.proposerUserId },
      });

      return selectedInfo;
    } catch (err) {
      throw err;
    }
  },

  // 상품별 제안 리스트 가져오기
  async listContentsGet(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      const selectedInfo = await ExchangeProposal.findAll({
        where: { proposerContentId: params.contentsId },
      });

      return selectedInfo;
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
