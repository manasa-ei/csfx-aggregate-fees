const Case = require('case');
const _ = require('lodash');
const BigNumber = require('bignumber.js');

module.exports = function (sequelize, DataTypes) {
  var Fees = sequelize.define(Case.snake('Fees'), {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    fee: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: 0,
      validate: {
        isInt: true
      },
      get: function() {
        return BigNumber(this.getDataValue("fee"));
      },
      set: function(fee) {
        return this.setDataValue("fee", fee.toNumber());
      }
    },
    currency: {
      type: DataTypes.ENUM('BTC', 'LTC', 'ETH', 'BCH', 'CAD'),
      defaultValue: null
    }
  }, {
    tableName: "fees",
    paranoid: true,
    underscore: true,
    timestamps: true,
    freezeTableName: true,
  });

  Fees.addFees = (fee, currency, lco) => {
    return new Promise((resolve, reject) => {
      let updateTransacion;
      sequelize.transaction({
        autocommit: false
      }).then(_updateTransaction => {
        updateTransacion = _updateTransaction;
        return Fees.findOne({where: { currency: currency }, 
          lock: updateTransacion.LOCK.UPDATE,
          transaction: updateTransacion
        });
      })
      .then(_order => {
        if(_.isEmpty(_order)) {
          Fees.create({fee: fee, currency: currency})
          .then(_createdOrder => {
            return resolve();
          })
          .catch(err => {
            return reject(err);
          })
        } else {
          _order.fee += fee;
          return _order.save({transaction: updateTransacion});
        }
      })
      .then(_updatedOrder => {
        return updateTransacion.commit();
      })
      .then(() => {
        resolve();
      })
      .catch(err => {
        updateTransacion.rollback();
        reject(err);
      })
    })
  }
  
  return Fees;
};