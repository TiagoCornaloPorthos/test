const createFilterOutDuplicatedContent = require('../../../../app/filterOutDuplicatedContent/createFilterOutDuplicatedContent');
const { MissingDependencyError } = require('../../../../app/errors');

test('given a valid argument, it should return a function', () => {
  const result = createFilterOutDuplicatedContent(() => {});
  expect(result).toBeInstanceOf(Function);
});

test('given no arguments, it should throw a MissingDependencyError', () => {
    expect(() => createFilterOutDuplicatedContent()).toThrowError(MissingDependencyError);
});

