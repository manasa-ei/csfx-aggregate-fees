const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Case = require('case');
const basename = path.basename(module.filename);
const { dbConfig } = require('../configs');
const db = {};
const _ = require('lodash');
// const xblog = require('../connections/xblog');
// const moduleLogger = xblog.moduleLogger();

const sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'mysql',
  pool: {
    max: dbConfig.connectionLimit,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});

sequelize.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    // moduleLogger.info("Connection has been established successfully.");
  })
  .catch((err) => {
    // moduleLogger.error("Unable to connect to the database ",{error:err});
  });

fs.readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[Case.pascal(model.name)] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.OrderLogs.sync();
db.Fees.sync();

// module.exports = db;
module.exports = _.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);