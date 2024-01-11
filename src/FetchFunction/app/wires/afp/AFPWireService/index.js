const { fetchJSON: fetch } = require('/opt/nodejs/fetch');
const createAFPWireServiceClass = require('./createAFPWireServiceClass');
const { getTokenFromDB } = require('/opt/nodejs/tokenDB');

module.exports = async function() {
  const AFPWireService = await createAFPWireServiceClass(fetch, getTokenFromDB);
  return new AFPWireService;
}
