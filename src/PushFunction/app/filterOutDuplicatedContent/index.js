const createFilterOutDuplicatedContent = require('./createFilterOutDuplicatedContent');
const getStoryService = require('../storyService');

const storyService = getStoryService();

module.exports = createFilterOutDuplicatedContent(storyService);
