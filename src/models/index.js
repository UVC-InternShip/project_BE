import sequelize from './connection.js';
import User from './user.js';
import Contents from './contents.js';
import Category from './category.js';
import ContentsImg from './contentsImg.js';
import ExchangeProposal from './exchangeProposal.js';
import Transactions from './transaction.js';
import Point from './point.js';
import Notifications from './notification.js';

const db = {};

db.sequelize = sequelize;

// 모델 등록
db.User = User;
db.Contents = Contents;
db.Category = Category;
db.ContentsImg = ContentsImg;
db.ExchangeProposal = ExchangeProposal;
db.Transactions = Transactions;
db.Point = Point;
db.Notifications = Notifications;

// 모델 초기화
Object.values(db).forEach((model) => {
  if (model.init) {
    model.init(sequelize);
  }
});

// 모델 간 관계 설정
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;
