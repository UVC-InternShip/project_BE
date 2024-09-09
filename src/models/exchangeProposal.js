import { Sequelize } from 'sequelize';

class ExchangeProposal extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        proposalId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
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
    this.belongsTo(models.User, {
      foreignKey: 'proposerUserId',
      targetKey: 'userId',
      as: 'proposerUser',
    });
    this.belongsTo(models.User, {
      foreignKey: 'offererUserId',
      targetKey: 'userId',
      as: 'receiverUser',
    });
    this.belongsTo(models.Contents, {
      foreignKey: 'contentsId',
      as: 'content',
    });
    this.belongsTo(models.Contents, {
      foreignKey: 'proposeContentId',
      targetKey: 'contentsId',
      as: 'proposeContent',
    });
  }
}

export default ExchangeProposal;
