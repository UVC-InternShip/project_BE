import { Sequelize } from 'sequelize';

class Contents extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true,
          references: {
            model: 'Users', // 참조할 모델 이름
            key: 'user_id', // Users 모델의 기본 키
          },
          onDelete: 'CASCADE', // 사용자가 삭제되면 이 레코드도 삭제
          onUpdate: 'CASCADE',
        },
        category_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Categories', // 참조할 모델 이름
            key: 'category_id', // Categories 모델의 기본 키
          },
          onDelete: 'SET NULL', // 카테고리가 삭제되면 이 레코드의 category_id를 null로 설정
          onUpdate: 'CASCADE',
        },
        title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        item_type: {
          type: Sequelize.ENUM('item', 'service'),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        purpose: {
          type: Sequelize.ENUM(
            'exchange',
            'sharing',
            'delivery_exchange',
            'delivery_sharing'
          ),
          allowNull: false,
          defaultValue: 0,
        },
        status: {
          type: Sequelize.ENUM('wating', 'promise', 'complete'),
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

export default Contents;
