const createSendContent = require('../../../../app/sendContent/createSendContent');
const { MissingDependencyError } = require('../../../../app/errors');

test('given a valid argument, it should return a function', () => {
  const result = createSendContent({});
  expect(result).toBeInstanceOf(Function);
});

test('given no arguments, it should throw a MissingDependencyError', () => {
  expect(() => createSendContent()).toThrowError(MissingDependencyError);
});
