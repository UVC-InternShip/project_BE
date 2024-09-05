import sequelize from './connection.js';
import User from './users.js';

const db = {};

db.sequelize = sequelize;

//model 생성
db.User = User;

//model init
User.init(sequelize);

export default db;
