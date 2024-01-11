const { MissingDependencyError, InvalidArgumentError } = require('../errors');
const { throwInvalidArgumentIfNotAnArray } = require('../validations');

module.exports = function(storyService) {
  if (storyService === undefined) {
    throw new MissingDependencyError(`'storyService' dependency should be provided. Got: ${storyService}`);
  }
  return async function(contents) {
    throwInvalidArgumentIfNotAnArray(contents, 'contents');
    const searchResults = await storyService.searchBySourceIds(contents.map(content => content.sourceId));
    return contents.filter(content => !searchResults.some(result => result.sourceId === content.sourceId));
  };
};
