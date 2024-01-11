const fetchFactory = require('../../../fetch/fetchFactory');
const { InvalidArgumentError } = require('../../../fetch/errors');

test('given all dependencies, it should return a fetch function', () => {
  const result = fetchFactory(() => {});
  expect(result).toBeInstanceOf(Function);
});

test.each([
  ['no arguments', []],
  ['an argument other than a function', [{}]]
])('given %s, it should throw an InvalidArgumentError', (message, args) => {
  expect(() => fetchFactory(...args)).toThrowError(InvalidArgumentError);
})
