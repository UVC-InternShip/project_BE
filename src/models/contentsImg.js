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
          unique: true,
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