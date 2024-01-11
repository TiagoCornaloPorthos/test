const createFetchAFPContent = require('../../../../../../app/wires/afp/createFetchAFPContent/createFetchAFPContent');
const { afpWireServiceNewsDocsReturnValueMock, afpWireEventMock } = require('../../../../../mocks/afp');
const { InvalidArgumentError } = require('../../../../../../app/errors');
const Wire = require('../../../../../../app/Wire');

const searchMock = jest.fn();
const afpWireService = {
  search: searchMock
};
const fetchAFPContent = createFetchAFPContent(afpWireService);

beforeEach(() => searchMock.mockReset());

describe('given valid arguments', () => {

  test('if documents are found, it should return an array of content objects', async () => {
    searchMock.mockResolvedValueOnce(afpWireServiceNewsDocsReturnValueMock);

    const result = await fetchAFPContent(new Wire(afpWireEventMock));

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

    const result = await fetchAFPContent(new Wire(afpWireEventMock));

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });
});

test.each([
  ['no argument', undefined],
  ['a string value', 'idontexists'],
  ['an object of type other than Wire ', {}]
])('given %s, it should throw an InvalidArgumentError', async (desc, value) => {
  await expect(fetchAFPContent(value)).rejects.toThrowError(InvalidArgumentError);
});
