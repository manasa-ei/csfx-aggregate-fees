const xblog = require('./connections/xblog');

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const { kafkaConfig } = require('./configs');
const { App } = require('@xblockchainlabs/willa');
const { AggregateFees } = require('./workers');
const { Currencies } = require('./controllers')

var app = express();
var cors = require('cors')
app.use(xblog.http().reqHandler);

const modulelogger = xblog.moduleLogger();

const kafkaApp = App('publishtrades', {
  kafka: {
    kafkaHost: kafkaConfig.kafkaBrokerURL
  }
});

kafkaApp.add(AggregateFees.feesPipeline);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
  next();
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.get('/currencies/:currency_name?', Currencies.currenctByName)
app.get('/', (req, res) => {
  res.send('I\'m collecting fees from everyone silently!!!')
});

app.use(function (req, res, next) {
  next(NotFound());
});

// error handler
app.use(function (err, req, res, next) {
  let code = (err !== undefined && err.statusCode !== undefined) ? err.statusCode : 500,
    msg = (err !== undefined && err.message !== undefined) ? err.message : 'Internal Server Error';
  const resData = {
    code: code,
    message: msg
  };
  return res.status(code).json({
    success: false,
    data: resData
  });
});

process.once( 'SIGTERM', function ( sig ) {
  modulelogger.info('Recived SIGTERM signal, Kue will be shutdown');
  queue().shutdown(500, function(err) {
    if(err){
      modulelogger.error( err, 'Kue shutdown encounter an error');
    } else {
      modulelogger.warn( 'Kue is gracefully shutdown');
    }
    process.exit( 0 );
  });
});

module.exports = app;