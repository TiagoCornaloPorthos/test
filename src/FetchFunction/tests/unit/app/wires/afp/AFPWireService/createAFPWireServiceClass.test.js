const createAFPWireServiceClass = require('../../../../../../app/wires/afp/AFPWireService/createAFPWireServiceClass');
const { InvalidArgumentError } = require('../../../../../../app/errors');

test('given valid dependencies, it should return a function', async () => {
  const getTokenMock = () => Promise.resolve('');
  const result = await createAFPWireServiceClass(() => {}, getTokenMock);
  expect(result).toBeInstanceOf(Function);
});

test.each([
  ['no arguments', []],
  ['only one non-function argument', [{}]],
  ['only one valid argument', [() => {}]],
  ['an non-function getToken argument', [() => {}, {}]],
  ['a non-function fetch argument', [{}, () => {}]],
  ['both non-function arguments', [{}, {}]],
])('given %s, it should throw an InvalidArgumentError',
  async (message, args) => {
    await expect(createAFPWireServiceClass(...args)).rejects.toThrowError(InvalidArgumentError);
  }
);
