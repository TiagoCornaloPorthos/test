const fetchContentFactory = require('../../../app/fetchContentFactory');
const Wire = require('../../../app/Wire');
const { InvalidArgumentError } = require('../../../app/errors');
const { efeWireEventMock } = require('../../mocks/efe');


test('given a wire instance, it should create a function', async () => {
  const fetchContent = await fetchContentFactory(new Wire(efeWireEventMock));
  expect(fetchContent).toBeInstanceOf(Function);
});

test.each([
  ['no argument', undefined],
  ['a string value', 'idontexists'],
  ['an object of type other than Wire ', {}]
])('given %s, it should throw an InvalidArgumentError', async (desc, value) => {
  await expect(fetchContentFactory(value)).rejects.toThrowError(InvalidArgumentError);
});

