import { Sequelize } from 'sequelize';

class Contents extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        contentsId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
        },
        contentsType: {
          type: Sequelize.ENUM('상품', '서비스'),
          allowNull: false,
        },
        purpose: {
          type: Sequelize.ENUM('교환', '나눔', '택배 교환', '택배 나눔'),
          allowNull: false,
          defaultValue: '교환',
        },
        status: {
          type: Sequelize.ENUM('대기중', '약속중', '완료'),
          allowNull: false,
          defaultValue: '대기중',
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
    this.hasMany(models.Transactions, {
      foreignKey: 'contentsId',
      as: 'transaction',
    });
    this.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    });
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    this.hasMany(models.ContentsImg, {
      foreignKey: 'contentsId',
      as: 'contentImg',
    });
    this.hasMany(models.ExchangeProposal, {
      foreignKey: 'proposerContentId',
      sourceKey: 'contentsId',
      as: 'proposerContent',
    });
    this.hasMany(models.ExchangeProposal, {
      foreignKey: 'contentsId',
      as: 'exchangeProposal',
    });
  }
}

export default Contents;
