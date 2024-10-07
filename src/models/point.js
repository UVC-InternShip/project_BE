import { Sequelize } from 'sequelize';

class Point extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        pointId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        weeklyPoints: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        totalPoints: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        lastUpdatedWeek: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: new Date().getWeek(),
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
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

export default Point;
