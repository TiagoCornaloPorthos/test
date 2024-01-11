const createPhotocenterImage = require('./createPhotocenterImage');
const fetch = require('/opt/nodejs/fetch');
const FormData = require('form-data');

module.exports = createPhotocenterImage(fetch, FormData)
