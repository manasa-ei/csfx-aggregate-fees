const { kafkaConfig } = require('../configs');
const { App, Pipelines, Kafka, Stream, Batch } = require('@xblockchainlabs/willa');
const pipeline = Pipelines();
const steelToe = require('steeltoe');
const { sequelize, Sequelize, OrderLogs, Fees } = require('../models')
  , Op = Sequelize.Op;
const BigNumber = require('bignumber.js');

pipeline.source(Kafka.consumer({ topic: kafkaConfig.tradesPublishTopic }))
.flow((data, err, next) => {
  const payload = steelToe(data)('payload')('after')();
  OrderLogs.create({
    order_log_id: steelToe(payload)('id')(),
    order_id : steelToe(payload)('order_id')(),
    matched_amount: steelToe(payload)('matched_amount')(),
    result_amount: steelToe(payload)('result_amount')(),
    cancel_amount: steelToe(payload)('cancel_amount')(),
    fee: steelToe(payload)('fee')(),
    unit_price: steelToe(payload)('unit_price')(),
    status: steelToe(payload)('status')(),
    buy_currency: steelToe(payload)('buy_currency')()
  });
  next(payload, err);
})
.flow(Batch.reduce({ number: 2, timeout: 30000, groupBy: "buy_currency", attributes: ["id", "order_id", 'fee']}, 
  (aggtr ,data) => {
    let num = parseInt(data.fee);
    aggtr.fees += num;
    return aggtr;
}, { fees:0}))
.sink((data, err, next) => {
  const payload = steelToe(data)('data')();
  let promises = [];
  payload.forEach(_payload => {
    const fees = BigNumber(steelToe(_payload)('argdata')('fees')());
    const currency = steelToe(_payload)('groupedBy')('buy_currency')();
    promises.push(Fees.addFees(fees, currency));
  })
  Promise.all(promises)
  .then(results => {
    next(data, err);
  })
  .catch( err => {
    next(data, err);
  })
});

exports.feesPipeline = pipeline;