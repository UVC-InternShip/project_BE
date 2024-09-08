import sequelize from './connection.js';
import User from './users.js';
import Contents from './contents.js';
import Category from './category.js';
import ContentsImg from './contentsImg.js';

const db = {};

db.sequelize = sequelize;

//model 생성
db.User = User;
db.Contents = Contents;
db.Category = Category;
db.ContentsImg = ContentsImg;

//model init
User.init(sequelize);
Contents.init(sequelize);
Category.init(sequelize);
ContentsImg.init(sequelize);

export default db;
