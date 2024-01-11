const getStoryService = require('../../../../app/storyService');
const StoryService = require('../../../../app/storyService/StoryService');

test('given no argument, it should return an instance of StoryService', () => {
  const result = getStoryService();
  expect(result).toBeInstanceOf(StoryService);
});

test("called twice, it should return the same StoryService's instance", () => {
  const firstCallResult = getStoryService();
  const secondCallResult = getStoryService();
  expect(Object.is(firstCallResult, secondCallResult)).toBe(true);
});
