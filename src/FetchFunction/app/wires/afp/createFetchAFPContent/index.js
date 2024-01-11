const createFetchAFPContent = require('./createFetchAFPContent');
const afpWireService = require('../AFPWireService');

module.exports = async function() {
  return createFetchAFPContent(await afpWireService())
};
