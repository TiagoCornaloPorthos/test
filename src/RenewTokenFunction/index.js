const getAFPToken = require('./getAFPToken');
const getEFEToken = require('./getEFEToken');

exports.handler = async function (event) {

  event.wire === 'EFE' && await getEFEToken()
  event.wire === 'AFP' && await getAFPToken()

};
