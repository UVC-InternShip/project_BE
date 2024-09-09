// sequelize와 User 모델 불러오기
import { Op } from 'sequelize';
import Contents from '../models/contents.js';
import Category from '../models/category.js';
import ContentsImg from '../models/contentsImg.js';

const ContentsDao = {
  // 상품 등록
  async insert(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      const inserted = await Contents.create(params);
      //console.log('🚀 ~ ContentsDao.create ~ inserted:', inserted);
      return inserted;
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

  // 상품 수정
  async update(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      const updated = await Contents.update(params, {
        where: { contents_id: params.id },
      });

      if (updated === 0) {
        throw new Error('상품 수정에 실패했습니다.');
      }

      const updatedContent = await Contents.findOne({
        where: { contents_id: params.id },
      });
      console.log('🚀 ~ update ~ updatedContent:', updatedContent);
      return updatedContent;
      //return updated;
    } catch (err) {
      throw err;
    }
  },

  // 상품 판매 상태 변경
  async updateStatus(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      const updated = await Contents.update(params, {
        where: { contents_id: params.id },
      });

      if (updated === 0) {
        throw new Error('상품 수정에 실패했습니다.');
      }

      const updatedContent = await Contents.findOne({
        where: { contents_id: params.id },
      });
      console.log('🚀 ~ update ~ updatedContent:', updatedContent);
      return updatedContent;
      //return updated;
    } catch (err) {
      throw err;
    }
  },

  // 상품 삭제
  async delete(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      const deleted = await Contents.destroy({
        where: { contents_id: params },
      });
      return deleted;
    } catch (err) {
      throw err;
    }
  },

  // 상품 리스트 가져오기
  async listGet() {
    // eslint-disable-next-line no-useless-catch
    try {
      const listInfo = await Contents.findAll();

      // 2. 모든 상품의 이미지 조회
      const contentsIds = listInfo.map((content) => content.contents_id);
      const images = await ContentsImg.findAll({
        where: { contents_id: contentsIds }, // 해당하는 상품들의 이미지 조회
        attributes: ['contents_id', 'image_url', 'order'], // 필요한 필드만 선택
      });

      // 3. 이미지 데이터를 contents_id를 기준으로 매핑
      const imagesByContentId = images.reduce((acc, image) => {
        if (!acc[image.contents_id]) {
          acc[image.contents_id] = [];
        }
        acc[image.contents_id].push({
          image_url: image.image_url,
          order: image.order,
        });
        return acc;
      }, {});

      // 4. 상품 리스트에 이미지 데이터를 추가
      const contentsWithImages = listInfo.map((content) => {
        return {
          ...content.toJSON(),
          images: imagesByContentId[content.contents_id] || [], // 해당 상품에 이미지가 있으면 추가, 없으면 빈 배열
        };
      });

      return contentsWithImages;
    } catch (err) {
      throw err;
    }
  },

  // 유저별 상품 리스트 가져오기
  async listUserGet(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      const selectedInfo = await Contents.findAll({
        where: { user_id: params.id },
      });

      // 2. 모든 상품의 이미지 조회
      const contentsIds = selectedInfo.map((content) => content.contents_id);
      const images = await ContentsImg.findAll({
        where: { contents_id: contentsIds }, // 해당하는 상품들의 이미지 조회
        attributes: ['contents_id', 'image_url', 'order'], // 필요한 필드만 선택
      });

      // 3. 이미지 데이터를 contents_id를 기준으로 매핑
      const imagesByContentId = images.reduce((acc, image) => {
        if (!acc[image.contents_id]) {
          acc[image.contents_id] = [];
        }
        acc[image.contents_id].push({
          image_url: image.image_url,
          order: image.order,
        });
        return acc;
      }, {});

      // 4. 상품 리스트에 이미지 데이터를 추가
      const contentsWithImages = selectedInfo.map((content) => {
        return {
          ...content.toJSON(),
          images: imagesByContentId[content.contents_id] || [], // 해당 상품에 이미지가 있으면 추가, 없으면 빈 배열
        };
      });

      return contentsWithImages;
    } catch (err) {
      throw err;
    }
  },

  // 상품 검색
  async search(searchParams, type) {
    // eslint-disable-next-line no-useless-catch
    try {
      const setQuery = {};
      if (searchParams.title) {
        // 이름을 기준으로 유사 검색을 수행합니다.
        setQuery.where = {
          ...setQuery.where,
          title: { [Op.like]: `%${searchParams.title}%` },
        };
      }
      console.log('🚀 ~ search ~ whereClause:', setQuery);
      // 상품 검색
      const results = await Contents.findAll({
        where: setQuery,
        order: [['id', 'DESC']], // 최신 상품 순으로 정렬
      });
      return results;
    } catch (err) {
      throw err;
    }
  },

  // 카테고리 가져오기
  async categoryGet() {
    // eslint-disable-next-line no-useless-catch
    try {
      const categoryList = await Category.findAll();
      return categoryList;
    } catch (err) {
      throw err;
    }
  },

  // 카테고리 추가하기
  async categoryPost(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      const inserted = await Category.create(params);
      console.log('🚀 ~ ContentsDao.create ~ inserted:', inserted);
      return inserted;
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

export default ContentsDao;
