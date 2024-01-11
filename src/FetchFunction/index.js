const app = require('./app');
const fetchContentFactory = require('./app/fetchContentFactory');
const sendContentItemsToQueue = require('./app/sendContentItemsToQueue');

const handler = app(fetchContentFactory, sendContentItemsToQueue, console);

exports.handler = handler;
