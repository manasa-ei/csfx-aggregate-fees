const Case = require('case'),
  _ = require('lodash');

module.exports = function (sequelize, DataTypes) {
  var OrderLogs = sequelize.define(Case.snake('OrderLogs'), {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    order_log_id: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    order_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    matched_amount: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: 0,
      validate: {
        isInt: true
      }
    },
    result_amount: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: 0,
      validate: {
        isInt: true
      }
    },
    cancel_amount : {
      type : DataTypes.BIGINT.UNSIGNED,
      defaultValue : 0,
      validate : {
        isInt : true
      }
    },
    fee: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: 0,
      validate: {
        isInt: true
      }
    },
    unit_price: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: 0,
      validate: {
        isInt: true
      }
    },
    status: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 1
    },
    buy_currency: {
      type: DataTypes.ENUM('BTC', 'LTC', 'ETH', 'BCH', 'CAD')
    }
  }, {
    tableName: "order_logs",
    paranoid: true,
    underscore: true,
    timestamps: true,
    freezeTableName: true,
  });
  
  return OrderLogs;
};