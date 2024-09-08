import { Sequelize } from 'sequelize';

class Category extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        category_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        category_name: {
          type: Sequelize.STRING(100),
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
}

export default Category;
