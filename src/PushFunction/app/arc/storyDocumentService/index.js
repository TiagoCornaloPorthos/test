const fetch = require('./loggedFetch');
const StoryDocumentService = require('./StoryDocumentService');

let instance;

function storyDocumentService() {
  if (!instance) {
    instance = new StoryDocumentService(fetch)
  }
  return instance;
}

module.exports = storyDocumentService;
