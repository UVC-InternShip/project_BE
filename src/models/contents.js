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
        content_type: {
          type: Sequelize.ENUM('상품', '서비스'),
          allowNull: false,
        },
        purpose: {
          type: Sequelize.ENUM('교환', '나눔', '택배 교환', '택배 나눔'),
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM(
            '교환 대기중',
            '나눔 대기중',
            '교환중',
            '나눔중',
            '완료'
          ),
          allowNull: false,
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
      foreignKey: 'proposeContentId',
      sourceKey: 'contentsId',
      as: 'proposeContent',
    });
    this.hasMany(models.ExchangeProposal, {
      foreignKey: 'contentsId',
      as: 'exchangeProposal',
    });
  }
}

export default Contents;
