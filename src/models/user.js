import { Sequelize } from 'sequelize';

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        phoneNumber: {
          type: Sequelize.STRING(30),
          unique: true,
          allowNull: false,
          validate: {
            isKoreanPhoneNumber(value) {
              const koreanPhoneNumberRegex =
                /^(010\d{8})$|^(010-\d{4}-\d{4})$|^(\+82-?10\d{8})$|^(\+82-?10-\d{4}-\d{4})$/;

              if (!koreanPhoneNumberRegex.test(value)) {
                throw new Error('적절하지 않은 전화번호 입니다!');
              }
            },
          },
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: true,
          },
        },
        reputationScore: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        role: {
          type: Sequelize.ENUM('admin', 'user'),
          allowNull: false,
          defaultValue: 'user',
        },
        profile: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: 0,
            max: 7,
          },
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        underscored: true,
        timestamps: true,
        paranoid: true,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Transactions, {
      foreignKey: 'offererId',
      sourceKey: 'userId',
      as: 'offerTransactions',
    });
    this.hasMany(models.Transactions, {
      foreignKey: 'proposerId',
      sourceKey: 'userId',
      as: 'proposeTransactions',
    });
    this.hasMany(models.Notifications, {
      foreignKey: 'userId',
      as: 'notifications',
    });
    this.hasOne(models.Point, {
      foreignKey: 'userId',
      as: 'point',
    });
    this.hasMany(models.ExchangeProposal, {
      foreignKey: 'proposerUserId',
      sourceKey: 'userId',
      as: 'ExchangeProposal',
    });
    this.hasMany(models.ExchangeProposal, {
      foreignKey: 'offererUserId',
      sourceKey: 'userId',
      as: 'ExchangeReceiver',
    });
  }
}

export default User;
