const { fetchJSON: fetch } = require('/opt/nodejs/fetch');
const ContentService = require('./ContentService');

let instance;

function contentService() {
  if (!instance) {
    instance = new ContentService(fetch)
  }
  return instance;
}

module.exports = contentService;
