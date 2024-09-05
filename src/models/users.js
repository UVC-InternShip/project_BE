import { Sequelize } from 'sequelize';

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        phoneNumber: {
          type: Sequelize.STRING(30),
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

export default User;
