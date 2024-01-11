const createFetchEFEContent = require('../../../../../../app/wires/efe/createFetchEFEContent/createFetchEFEContent');
const { MissingDependencyError } = require('../../../../../../app/errors');

test('given a valid argument, it should return a function', () => {
  const result = createFetchEFEContent({});
  expect(result).toBeInstanceOf(Function);
});

test('given no arguments, it should throw a MissingDependencyError', () => {
  expect(() => createFetchEFEContent()).toThrowError(MissingDependencyError);
});
