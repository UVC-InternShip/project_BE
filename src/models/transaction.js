import { Sequelize } from 'sequelize';

class Transactions extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        transactionId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        purpose: {
          type: Sequelize.ENUM('교환', '나눔'),
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
    this.belongsTo(models.Contents, {
      foreignKey: 'contentsId',
      as: 'content',
    });
    this.belongsTo(models.User, {
      foreignKey: 'offererId',
      targetKey: 'userId',
      as: 'offerer',
    });
    this.belongsTo(models.User, {
      foreignKey: 'proposerId',
      targetKey: 'userId',
      as: 'proposer',
    });
  }
}

export default Transactions;
