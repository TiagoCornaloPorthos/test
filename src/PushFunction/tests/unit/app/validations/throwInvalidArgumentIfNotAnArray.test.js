const { throwInvalidArgumentIfNotAnArray } = require('../../../../app/validations');
const { InvalidArgumentError } = require('../../../../app/errors');

test('given an array, it should return undefined', () => {
  const result = throwInvalidArgumentIfNotAnArray([]);
  expect(result).toBeUndefined();
});

test.each([
  ['no argument', undefined],
  ['a string', 'wireString'],
  ['an object of type other than Array', {}],
  ['a number', 5],
])('given %s, it should throw an InvalidArgumentError', (desc, value) => {
  expect(() => throwInvalidArgumentIfNotAnArray(value)).toThrowError(InvalidArgumentError);
});
