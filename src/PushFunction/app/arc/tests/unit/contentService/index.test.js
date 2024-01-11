const contentService = require('../../../contentService');
const ContentService = require('../../../contentService/ContentService');

test('given no argument, it should return an instance of ContentService', () => {
  const result = contentService();
  expect(result).toBeInstanceOf(ContentService);
});

test("called twice, it should return the same ContentService's instance", () => {
  const firstCallResult = contentService();
  const secondCallResult = contentService();
  expect(Object.is(firstCallResult, secondCallResult)).toBe(true);
});
