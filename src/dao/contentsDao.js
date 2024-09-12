import Op from 'sequelize';
import Contents from '../models/contents.js';

// ContentsDao 객체를 정의, 이 객체는 데이터베이스에 대한 CRUD 연산을 수행한다.
const ContentsDao = {
  // 상품 등록
  insert(params) {
    console.log('🚀 ~ insert ~ params:', params);
    // Promise 객체를 반환합니다. 비동기 처리를 위해 사용됩니다.
    return new Promise((resolve, reject) => {
      // contents 모델을 사용하여 새 사용자를 생성합니다. params는 새 사용자 정보를 담고 있습니다.
      Contents.create(params)
        .then((inserted) => {
          console.log('🚀 ~ User.create ~ inserted:', inserted);
          // console.log(JSON.parse(JSON.stringify(inserted))); // 불필요한 정보를 제외해서 보여준다.
          // 삽입된 사용자 정보에서 비밀번호를 제외하고 나머지 정보만을 추출합니다.
          //const { password, ...newInserted } = JSON.parse(JSON.stringify(inserted));
          // 처리가 성공했을 때, 비밀번호를 제외한 사용자 정보를 반환합니다.
          resolve(inserted);
        })
        .catch((err) => {
          // 처리 중 에러가 발생하면 에러를 반환합니다.
          reject(err);
        });
    });
  },

  //상품 수정
  update() {
    console.log('🚀 ~ insert ~ params:');
    return new Promise((resolve, reject) => {
      Contents.findAll()
        .then((inserted) => {
          console.log('🚀 ~ User.allUsers ~ inserted:', inserted);
          resolve(inserted);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  //상품 판매 상태 변경
  updateStatus(params) {
    // 검색 조건을 설정합니다.
    const setQuery = {};
    if (params.ids) {
      // ids 배열을 통해 여러 사용자를 조회할 수 있습니다. 예) [1,2,3,4]
      setQuery.where = {
        ...setQuery.where,
        id: params.ids,
      };
    }
    if (params.name) {
      // 이름을 기준으로 유사 검색을 수행합니다.
      setQuery.where = {
        ...setQuery.where,
        name: { [Op.like]: `%${params.name}%` },
      };
    }
    if (params.userID) {
      // userID를 기준으로 유사 검색을 수행합니다.
      setQuery.where = {
        ...setQuery.where,
        userID: { [Op.like]: `%${params.userID}%` },
      };
    }
    if (params.email) {
      // 이메일을 기준으로 정확한 검색을 수행합니다.
      setQuery.where = {
        ...setQuery.where,
        email: params.email,
      };
    }
    if (params.phone) {
      // 전화번호를 기준으로 정확한 검색을 수행합니다.
      setQuery.where = {
        ...setQuery.where,
        phone: params.phone,
      };
    }
    if (params.addrLat) {
      // 주소의 위도를 기준으로 정확한 검색을 수행합니다.
      setQuery.where = {
        ...setQuery.where,
        addrLat: params.addrLat,
      };
    }
    if (params.addrLng) {
      // 주소의 경도를 기준으로 정확한 검색을 수행합니다.
      setQuery.where = {
        ...setQuery.where,
        addrLng: params.addrLng,
      };
    }

    // 결과를 id 내림차순으로 정렬합니다.
    setQuery.order = [['id', 'DESC']];
    // limit와 offset을 설정하여 페이징 처리를 구현할 수 있습니다.
    if (params.limit) {
      setQuery.limit = params.limit;
    }
    if (params.offset) {
      setQuery.offset = params.offset;
    }

    // Promise 객체를 반환합니다. 비동기 처리를 위해 사용됩니다.
    return new Promise((resolve, reject) => {
      // User 모델을 사용하여 조건에 맞는 사용자 목록과 총 개수를 조회합니다.
      // 비밀번호를 제외한 모든 속성과 관련 Department 정보를 포함합니다.
      Contents.findAndCountAll({
        ...setQuery,
        attributes: { exclude: ['password'] }, // 비밀번호는 제외
      })
        .then((selectedList) => {
          // 조회 성공 시, 사용자 목록을 반환합니다.
          resolve(selectedList);
        })
        .catch((err) => {
          // 처리 중 에러가 발생하면 에러를 반환합니다.
          reject(err);
        });
    });
  },

  //상품 삭제
  delete(params) {
    return new Promise((resolve, reject) => {
      Contents.findOne({
        //attributes: ['id', 'user_i_d', 'password', 'name'],
        where: [{ user_i_d: params.userID, password: params.password }],
      })
        .then((selectedInfo) => {
          resolve(selectedInfo);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  //상품 리스트 가져오기
  // 상품 리스트 가져오기
  async listGet() {
    // eslint-disable-next-line no-useless-catch
    try {
      const listInfo = await Contents.findAll();

      return listInfo;
    } catch (err) {
      throw err;
    }
  },

  //유저별 상품 리스트 가져오기
  listUserGet(params) {
    return new Promise((resolve, reject) => {
      Contents.findOne({
        //attributes: ['id', 'user_i_d', 'password', 'name'],
        where: [{ user_i_d: params.userID }],
      })
        .then((selectedInfo) => {
          resolve(selectedInfo);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  //상품검색
  search(params) {
    return new Promise((resolve, reject) => {
      Contents.findOne({
        //attributes: ['id', 'user_i_d', 'password', 'name'],
        where: [{ email: params.email }],
      })
        .then((selectedInfo) => {
          resolve(selectedInfo);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // 카테고리 가져오기
  categoryGet(params) {
    return new Promise((resolve, reject) => {
      Contents.update(params, {
        where: { id: params.id },
      })
        .then(([updated]) => {
          resolve({ updatedCount: updated });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  //완전 삭제
  deleteForce(params) {
    return new Promise((resolve, reject) => {
      Contents.destroy({
        where: { id: params.id },
        force: true,
      })
        .then((deleted) => {
          resolve({ deletedCount: deleted });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export default ContentsDao;
