const createPushContent = require('./createPushContent');
const wireEfeAdapter = require('../wireEfeAdapter');
const wireAfpAdapter = require('../wireAfpAdapter');
const imageEfeAdapter = require('../imageEfeAdapter');
const imageARCAdapter = require('../imageARCAdapter');
const createPhotocenterImage = require('../arc/photocenter')
const getStoryService = require('../storyService');

const storyService = getStoryService();

module.exports = createPushContent(wireEfeAdapter, wireAfpAdapter, imageEfeAdapter, imageARCAdapter, createPhotocenterImage, storyService);
