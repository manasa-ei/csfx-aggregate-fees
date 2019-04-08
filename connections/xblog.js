const { xblogConfig } = require('../configs');

const xblog = require('@xblockchainlabs/xblog');
xblog.init({
  logConfig: {
    name: xblogConfig.name,
    blackList:['/']
  },
  outConfig: {
    logOut: xblogConfig.logOut,
    index: xblogConfig.esindex,
    host: xblogConfig.eshost
  }
});

module.exports = xblog;