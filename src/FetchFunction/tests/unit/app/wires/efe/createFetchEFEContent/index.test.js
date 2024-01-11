const createFetchEFEContent = require('../../../../../../app/wires/efe/createFetchEFEContent/createFetchEFEContent');
const Wire = require('../../../../../../app/Wire');
const { efeWireServiceTextItemsReturnValueMock, efeWireEventMock } = require('../../../../../mocks/efe');
const { InvalidArgumentError } = require('../../../../../../app/errors');

const searchMock = jest.fn();
const efeWireService = {
  getItemListByProductId: searchMock
};
const fetchEFEContent = createFetchEFEContent(efeWireService);

beforeEach(() => searchMock.mockReset());

describe('given valid arguments', () => {

  test('if items are found, it should return an array of content objects', async () => {
    searchMock.mockResolvedValueOnce(efeWireServiceTextItemsReturnValueMock);

    const result = await fetchEFEContent(new Wire(efeWireEventMock));

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
    result.forEach(content => expect(content).toMatchObject(
      expect.objectContaining({
        source: expect.any(String),
        id: expect.any(String),
        publish: expect.any(Boolean),
        data: expect.any(Object)
      })
    ));
  });

  test('if no documents are found, it should return an empty array', async () => {
    searchMock.mockResolvedValueOnce([]);

    const result = await fetchEFEContent(new Wire(efeWireEventMock));

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });
});


test.each([
  ['no argument', undefined],
  ['a string value', 'idontexists'],
  ['an object of type other than Wire ', {}]
])('given %s, it should throw an InvalidArgumentError', async (desc, value) => {
  await expect(fetchEFEContent(value)).rejects.toThrowError(InvalidArgumentError);
});
