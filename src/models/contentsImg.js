import { Sequelize } from 'sequelize';

class ContentsImg extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        imageId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },

        imageUrl: {
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

  static associate(models) {
    this.belongsTo(models.Contents, {
      foreignKey: 'contentsId',
      as: 'contents',
    });
  }
}

export default ContentsImg;
