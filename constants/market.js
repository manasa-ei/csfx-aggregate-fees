module.exports = {
  ORDER_TYPE: {
    LIMIT: 2,
    limit: 2,
    MARKET:1,
    market: 1
  },
  ACTIONS: {
    BUY: 1,
    buy: 1,
    SELL: 2,
    sell: 2
  },
  CURRENCIES: {
    BTC: 1,
    LTC: 2
  },
  AVAILABLE_MARKETS: {
    BTC_LTC: 1,
    LTC_BTC: 2
  },
  CURRENCY_NAMES: {
    BTC: "Bitcoin",
    LTC: "Litecoin"
  },
  WITHDRAWAL_FEES: {
    BTC: 20000
  },
  ORDER_STATUS: {
    OPEN: 1,
    PARTIALYY_COMPLETED: 2,
    COMPLETED: 3
  },
  SETTLEMENT_STATUS: {
    SETTLEMENT_REQUIRED: 1,
    SETTLEMENT_DONE: 2,
    MANUAL_SETTLEMENT_REQUIRED: 3
  },
  DEFAULT_WITHDRAWAL_FEE: 200000,
  CURRENCY_PRECISION: 100000000,
};