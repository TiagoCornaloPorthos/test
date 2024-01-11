const createSendContentItemsToQueue = require('../../../../app/sendContentItemsToQueue/createSendContentItemsToQueue');
const { InvalidArgumentError } = require('../../../../app/errors');

test('given a valid argument, it should return a function', () => {
  const result = createSendContentItemsToQueue(() => {});
  expect(result).toBeInstanceOf(Function);
});

test.each([
  ['no arguments', []],
  ['a non-function argument', [{}]]
])('given %s, it should throw an InvalidArgumentError',
  (message, args) => {
    expect(() => createSendContentItemsToQueue(...args)).toThrowError(InvalidArgumentError);
  }
);
