const createSendContentItemsToQueue = require('./createSendContentItemsToQueue');
const sendContent = require('../sendContent');

module.exports = createSendContentItemsToQueue(sendContent);
