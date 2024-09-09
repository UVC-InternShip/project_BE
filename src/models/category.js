import { Sequelize } from 'sequelize';

class Category extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        categoryId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        categoryName: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
      },
      {
        sequelize,
        underscored: true,
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Contents, { foreignKey: 'categoryId', as: 'contents' });
  }
}

export default Category;
