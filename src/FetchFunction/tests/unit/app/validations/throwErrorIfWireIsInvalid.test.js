const { throwErrorIfWireIsInvalid } = require('../../../../app/validations');
const { InvalidArgumentError } = require('../../../../app/errors');
const Wire = require('../../../../app/Wire');
const { efeWireEventMock } = require('../../../mocks/efe');

test('given a wire instance, it should return undefined', () => {
  const result = throwErrorIfWireIsInvalid(new Wire(efeWireEventMock));
  expect(result).toBeUndefined();
});

test.each([
  ['no argument', undefined],
  ['a string', 'wireString'],
  ['an object of type other than Wire', {}],
  ['an array', []],
  ['a number', 5],
])('given %s, it should throw an InvalidArgumentError', (desc, value) => {
  expect(() => throwErrorIfWireIsInvalid(value)).toThrowError(InvalidArgumentError);
});
