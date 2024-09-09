import sequelize from './connection.js';
import User from './users.js';
import Contents from './contents.js';
import Category from './category.js';
import CnotentsImg from './contentsImg.js';

const db = {};

db.sequelize = sequelize;

//model 생성
db.User = User;
db.Contents = Contents;
db.Category = Category;
db.CnotentsImg = CnotentsImg;

//model init
User.init(sequelize);
Contents.init(sequelize);
Category.init(sequelize);
CnotentsImg.init(sequelize);

export default db;
