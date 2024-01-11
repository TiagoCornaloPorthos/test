const app = require('../../../app');
const { MissingDependencyError } = require('../../../app/errors');

test('given all arguments, it should return a handler function', () => {
  const result = app(() => {}, () => {}, {});
  expect(result).toBeInstanceOf(Function);
});

test.each([
  ['no arguments', []],
  ['1 argument', [() => {}]],
  ['2 arguments', [() => {}, () => {}]]
])('given %s, it should throw an MissingDependencyError', (message, dependencies) => {
  expect(() => app(...dependencies)).toThrowError(MissingDependencyError);
})
