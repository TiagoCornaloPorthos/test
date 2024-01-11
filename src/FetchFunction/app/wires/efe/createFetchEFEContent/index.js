const createFetchEFEContent = require('./createFetchEFEContent');
const EFEWireService = require('../EFEWireService');
const { fetchJSON: fetch } = require('/opt/nodejs/fetch');
const AWS = require("aws-sdk")

module.exports = async function() {
  const efeWireService = new EFEWireService(fetch, new AWS.DynamoDB.DocumentClient);
  return createFetchEFEContent(efeWireService)
};
