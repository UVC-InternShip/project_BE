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
      console.log('🚀 ~ ContentsDao.create ~ inserted:', inserted);
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
        where: { contentsId: params.contentsId },
      });

      if (updated === 0) {
        throw new Error('상품 수정에 실패했습니다.');
      }

      const updatedContent = await Contents.findOne({
        where: { contentsId: params.contentsId },
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
        where: { contentsId: params.contentsId },
      });

      if (updated === 0) {
        throw new Error('상품 수정에 실패했습니다.');
      }

      const updatedContent = await Contents.findOne({
        where: { contentsId: params.contentsId },
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
      const listInfo = await Contents.findAll({
        order: [['contentsId', 'ASC']], // contentsId 기준 오름차순 정렬
      });

      // 2. 모든 상품의 이미지 조회
      const contentsIds = listInfo.map((content) => content.contentsId);
      const images = await ContentsImg.findAll({
        where: { contentsId: contentsIds }, // 해당하는 상품들의 이미지 조회
        attributes: ['contentsId', 'imageUrl', 'order'], // 필요한 필드만 선택
      });

      // 3. 이미지 데이터를 contentsId를 기준으로 매핑
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

      // 4. 상품 리스트에 이미지 데이터를 추가
      const contentsWithImages = listInfo.map((content) => {
        return {
          ...content.toJSON(),
          images: imagesByContentId[content.contentsId] || [], // 해당 상품에 이미지가 있으면 추가, 없으면 빈 배열
        };
      });

      return contentsWithImages;
    } catch (err) {
      throw err;
    }
  },

  // 상품 리스트 가져오기 무한스크롤
  async listGetScroll(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      // 데이터 조회 (예시로 Sequelize 사용)
      const { rows, count } = await Contents.findAndCountAll({
        offset: params.offset,
        limit: params.limit,
        order: [['contentsId', 'ASC']], // contentsId 기준 오름차순 정렬
      });

      // 2. 모든 상품의 이미지 조회
      const contentsIds = rows.map((content) => content.dataValues.contentsId);
      const images = await ContentsImg.findAll({
        where: { contentsId: contentsIds }, // 해당하는 상품들의 이미지 조회
        attributes: ['contentsId', 'imageUrl', 'order'], // 필요한 필드만 선택
      });

      // 3. 이미지 데이터를 contentsId를 기준으로 매핑
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

      // 4. 상품 리스트에 이미지 데이터를 추가
      const contentsWithImages = rows.map((content) => {
        return {
          ...content.dataValues, // 상품 데이터
          images: imagesByContentId[content.dataValues.contentsId] || [], // 해당 상품의 이미지가 있으면 추가
        };
      });
      console.log(
        '🚀 ~ contentsWithImages ~ contentsWithImages:',
        contentsWithImages
      );

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
        where: { userId: params.userId },
      });

      // 2. 모든 상품의 이미지 조회
      const contentsIds = selectedInfo.map((content) => content.contentsId);
      const images = await ContentsImg.findAll({
        where: { contentsId: contentsIds }, // 해당하는 상품들의 이미지 조회
        attributes: ['contentsId', 'imageUrl', 'order'], // 필요한 필드만 선택
      });

      // 3. 이미지 데이터를 contentsId를 기준으로 매핑
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

      // 4. 상품 리스트에 이미지 데이터를 추가
      const contentsWithImages = selectedInfo.map((content) => {
        return {
          ...content.toJSON(),
          images: imagesByContentId[content.contentsId] || [], // 해당 상품에 이미지가 있으면 추가, 없으면 빈 배열
        };
      });
      return contentsWithImages;
    } catch (err) {
      throw err;
    }
  },

  // 유저별 상품 리스트 가져오기 무한스크롤
  async listUserGetScroll(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      const { rows, count } = await Contents.findAndCountAll({
        where: { userId: params.userId },
        offset: params.offset,
        limit: params.limit,
        order: [['contentsId', 'ASC']], // contentsId 기준 오름차순 정렬
      });

      // 2. 모든 상품의 이미지 조회
      const contentsIds = rows.map((content) => content.dataValues.contentsId);
      const images = await ContentsImg.findAll({
        where: { contentsId: contentsIds }, // 해당하는 상품들의 이미지 조회
        attributes: ['contentsId', 'imageUrl', 'order'], // 필요한 필드만 선택
      });

      // 3. 이미지 데이터를 contentsId를 기준으로 매핑
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

      // 4. 상품 리스트에 이미지 데이터를 추가
      const contentsWithImages = rows.map((content) => {
        return {
          ...content.dataValues, // 상품 데이터
          images: imagesByContentId[content.dataValues.contentsId] || [], // 해당 상품의 이미지가 있으면 추가
        };
      });
      console.log(
        '🚀 ~ contentsWithImages ~ contentsWithImages:',
        contentsWithImages
      );

      return contentsWithImages;
    } catch (err) {
      throw err;
    }
  },

  // 번호로 상품 리스트 가져오기
  async listContentsGet(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      const selectedInfo = await Contents.findAll({
        where: { contentsId: params.contentsId },
      });

      // 2. 모든 상품의 이미지 조회
      const contentsIds = selectedInfo.map((content) => content.contentsId);
      const images = await ContentsImg.findAll({
        where: { contentsId: contentsIds }, // 해당하는 상품들의 이미지 조회
        attributes: ['contentsId', 'imageUrl', 'order'], // 필요한 필드만 선택
      });

      // 3. 이미지 데이터를 contentsId를 기준으로 매핑
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

      // 4. 상품 리스트에 이미지 데이터를 추가
      const contentsWithImages = selectedInfo.map((content) => {
        return {
          ...content.toJSON(),
          images: imagesByContentId[content.contentsId] || [], // 해당 상품에 이미지가 있으면 추가, 없으면 빈 배열
        };
      });

      return contentsWithImages;
    } catch (err) {
      throw err;
    }
  },

  // 상품 검색
  async search(searchParams) {
    try {
      const setQuery = {
        where: {},
      };

      if (searchParams.title) {
        // title이 문자열인지 확인하는 로그
        console.log('Title Type:', typeof searchParams.title); // string 타입이어야 함
        console.log('Title Value:', searchParams.title);

        // Op.like 사용 로그
        setQuery.where[Op.or] = [
          { title: { [Op.like]: `%${searchParams.title}%` } },
          { description: { [Op.like]: `%${searchParams.title}%` } },
        ];
        console.log('🚀 ~ search ~ whereClause1:', setQuery);
        console.log('🚀 ~ SQL Query:', JSON.stringify(setQuery, null, 2));
      }

      if (searchParams.purpose == '교환' || searchParams.purpose == '나눔') {
        // type이 있는 경우 Op.eq 조건 추가
        if (searchParams.purpose) {
          console.log('Type Value:', searchParams.purpose); // type 값 확인
          setQuery.where.purpose = { [Op.eq]: searchParams.purpose }; // 정확히 일치하는 type을 찾기 위해 eq 사용
        }
        console.log('🚀 ~ search ~ whereClause2:', setQuery);
      }

      // 이후의 쿼리 실행
      const results = await Contents.findAll({
        where: setQuery.where, // 조건을 설정하는 부분 (필요한 경우 설정)
        order: [['contentsId', 'ASC']], // contentsId 기준 오름차순 정렬
      });

      // 2. 모든 상품의 이미지 조회
      const contentsIds = results.map((content) => content.contentsId);
      const images = await ContentsImg.findAll({
        where: { contentsId: contentsIds }, // 해당하는 상품들의 이미지 조회
        attributes: ['contentsId', 'imageUrl', 'order'], // 필요한 필드만 선택
      });

      // 3. 이미지 데이터를 contentsId를 기준으로 매핑
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

      // 4. 상품 리스트에 이미지 데이터를 추가
      const contentsWithImages = results.map((content) => {
        return {
          ...content.toJSON(),
          images: imagesByContentId[content.contentsId] || [], // 해당 상품에 이미지가 있으면 추가, 없으면 빈 배열
        };
      });
      console.log(
        '🚀 ~ contentsWithImages ~ contentsWithImages:',
        contentsWithImages
      );
      return contentsWithImages;
    } catch (error) {
      console.error(error);
      throw error;
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
