const createFetchAFPContent = require('../../../../../../app/wires/afp/createFetchAFPContent/createFetchAFPContent');
const { MissingDependencyError } = require('../../../../../../app/errors');

test('given a valid argument, it should return a function', () => {
  const result = createFetchAFPContent({});
  expect(result).toBeInstanceOf(Function);
});

test('given no arguments, it should throw a MissingDependencyError', () => {
  expect(() => createFetchAFPContent()).toThrowError(MissingDependencyError);
});
