const createFilterOutDuplicatedContent = require('../../../../app/filterOutDuplicatedContent/createFilterOutDuplicatedContent');
const { InvalidArgumentError } = require('../../../../app/errors');

describe('given an array of contents', () => {
  const contentsToBeFiltered = [{ sourceId: 'wire-1111', data: '' }, { sourceId: 'wire-1112', data: '' }];

  test('it should return a new array with filtered out content', async () => {
    const [ contentToBeFilteredOut ] = contentsToBeFiltered;
    const storyServiceMock = createStoryServiceMockWithSearchResults([{
      sourceId: contentToBeFilteredOut.sourceId
    }]);
    const filterOutDuplicatedContent = createFilterOutDuplicatedContent(storyServiceMock);

    const result = await filterOutDuplicatedContent(contentsToBeFiltered);

    expect(result).not.toContainEqual(contentToBeFilteredOut);
  });

  test(`if no duplicated contents, it should return all given contents`, async () => {
    const storyServiceMock = createStoryServiceMockWithSearchResults([]);
    const filterOutDuplicatedContent = createFilterOutDuplicatedContent(storyServiceMock);

    const result = await filterOutDuplicatedContent(contentsToBeFiltered);

    expect(result).toEqual(contentsToBeFiltered)
  });

  test(`if all contents duplicated, it should return an empty array`, async () => {
    const searchResults = contentsToBeFiltered.map(content => ({ sourceId: content.sourceId }) )
    const storyServiceMock = createStoryServiceMockWithSearchResults(searchResults);
    const filterOutDuplicatedContent = createFilterOutDuplicatedContent(storyServiceMock);

    const result = await filterOutDuplicatedContent(contentsToBeFiltered);

    expect(result).toEqual([]);
  });

});

function createStoryServiceMockWithSearchResults(searchResults) {
  return storyServiceMock = {
    searchBySourceIds: function() {
      return Promise.resolve(searchResults);
    }};
}

test.each([
  ['no arguments', []],
  ['a non-Array value as first argument', [{}]],
])('given %s, it should throw an InvalidArgumentError',
  async (message, args) => {
    const storyServiceMock = {};
    const filterOutDuplicatedContent = createFilterOutDuplicatedContent(storyServiceMock);
    await expect(filterOutDuplicatedContent(...args))
      .rejects
      .toThrowError(InvalidArgumentError);
  });


