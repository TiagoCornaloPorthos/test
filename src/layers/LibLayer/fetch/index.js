const factory = require('./fetchFactory');
const nodeFetch = require('node-fetch');

const fetch = factory(nodeFetch)

module.exports = exports = fetch;

exports.fetchJSON = async (...args) => {
  const res = await fetch(...args);
  return res.json();
};
