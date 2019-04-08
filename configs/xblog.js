module.exports = {
  logLevel: (process.env.LOG_LEVEL || 'info'),
  pretify: (process.env.LOG_PRETIFY || false),
  logOut: (process.env.LOG_OUT || 'console'),
  esindex: (process.env.LOG_ES_INDEX || 'cfxlog'),
  eshost: (process.env.LOG_ES_HOST || '35.192.146.229:9200'),
  name: (process.env.LOG_NAME || 'market'),
};