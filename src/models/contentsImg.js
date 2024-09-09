import { Sequelize } from 'sequelize';
//import Contents from './contents.js'; // 상품 모델

class ContentsImg extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        image_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        contents_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          // references: {
          //   model: Contents, // Contents 모델을 참조
          //   key: 'contents_id',
          // },
          onDelete: 'CASCADE', // 사용자가 삭제되면 이 레코드도 삭제
          onUpdate: 'CASCADE',
        },
        image_url: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        order: {
          type: Sequelize.INTEGER,
          allowNull: true,
          unique: false, // 하나의 상품에 여러 이미지가 있을 수 있음
        },
      },
      {
        sequelize,
        underscored: true,
        timestamps: true,
        paranoid: true,
      }
    );
  }
}

// 상품과 이미지 관계 설정 (1:N)
//Contents.hasMany(ContentsImg, { foreignKey: 'contents_id' });
//ContentsImg.belongsTo(Contents, { foreignKey: 'contents_id' });

export default ContentsImg;
