const storyDocumentService = require('../../../storyDocumentService');
const StoryDocumentService = require('../../../storyDocumentService/StoryDocumentService');

test('given no argument, it should return an instance of StoryDocumentService', () => {
  const result = storyDocumentService();
  expect(result).toBeInstanceOf(StoryDocumentService);
});

test("called twice, it should return the same StoryDocumentService's instance", () => {
  const firstCallResult = storyDocumentService();
  const secondCallResult = storyDocumentService();
  expect(Object.is(firstCallResult, secondCallResult)).toBe(true);
});
