const { SQS } = require('aws-sdk');
const createSendContent = require('./createSendContent');

const sqs = new SQS({apiVersion: '2012-11-05'});

module.exports = createSendContent(sqs);
