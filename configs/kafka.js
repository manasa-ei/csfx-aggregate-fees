module.exports = {
  kafkaBrokerURL: (process.env.KAFKA_HOST || '18.206.153.242:9092'),
  tradesPublishTopic: (process.env.KAFKA_TRADES_PUBLISH_TOPIC || 'cfinx-develop.cosfinex_market.order_logs'),
  orderLogsTopic: (process.env.KAFKA_TOPIC_ORDER_LOGS || 'mydb.cosfinex_market.order_logs'),
  ordersTopic: (process.env.KAFKA_TOPIC_ORDERS || 'mydb.cosfinex_market.order_logs')
}