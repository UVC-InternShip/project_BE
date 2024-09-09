import { Sequelize } from 'sequelize';

class Notifications extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        notifyId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        type: {
          type: Sequelize.ENUM('교환요청', '채팅알림', '나눔완료'),
          allowNull: false,
        },
        message: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        isRead: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
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

export default Notifications;
