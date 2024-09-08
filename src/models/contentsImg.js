import { Sequelize } from 'sequelize';

class ContentsImg extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        image_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        contents_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true,
          references: {
            model: 'User', // 참조할 모델 이름
            key: 'contents_id', // Users 모델의 기본 키
          },
          onDelete: 'CASCADE', // 사용자가 삭제되면 이 레코드도 삭제
          onUpdate: 'CASCADE',
        },
        image_url: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        order: {
          type: Sequelize.INTEGER,
          allowNull: true,
          unique: true,
          validate: {
            isEmail: true,
          },
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

export default ContentsImg;
