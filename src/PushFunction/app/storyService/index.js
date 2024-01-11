const {
  storyDocumentService: getStoryDocumentService,
  contentService: getContentService
} = require('../arc');
const StoryService = require('./StoryService');

let instance;

function storyService() {
  if (!instance) {
    const storyDocumentService = getStoryDocumentService();
    const contentService = getContentService();
    instance = new StoryService(storyDocumentService, contentService);
  }
  return instance;
}

module.exports = storyService;
