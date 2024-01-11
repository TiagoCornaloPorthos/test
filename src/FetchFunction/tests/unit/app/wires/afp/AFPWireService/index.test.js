const createAFPWireServiceClass = require('../../../../../../app/wires/afp/AFPWireService/createAFPWireServiceClass');
const { InvalidArgumentError } = require('../../../../../../app/errors');
const { afpEmptySearchResponseMock, afpNewsSearchResponseMock } = require('../../../../../mocks/afp')

const fetchMock = jest.fn();
const getTokenMock = () => Promise.resolve('');
let afpWireService;

beforeAll(async () => {
  const AFPWireService = await createAFPWireServiceClass(fetchMock, getTokenMock);
  afpWireService = new AFPWireService;
});

beforeEach(() => fetchMock.mockReset())

describe('AFPWireService::search', () => {
  describe('given valid arguments', () => {
    test.each([
      [
        'if content found, it should return an array of documents',
        afpNewsSearchResponseMock,
        afpNewsSearchResponseMock.response.docs.length
      ],
      [
        'if no content found, it should return an empty array',
        afpEmptySearchResponseMock,
        0
      ]
    ])('%s', async (msg, afpResponseMock, length) => {
      const dateRange = { dateFrom: new Date(), dateTo: new Date() };
      fetchMock.mockResolvedValueOnce(afpResponseMock);

      const result = await afpWireService.search(dateRange);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(length);
    });
  });

  test.each([
    ['no argument', undefined],
    ['a string value', 'idontexists'],
    ['an empty object literal', {}],
    ['a function', () => {}],
    [`a dateRange object with no 'dateFrom' property`, {dateTo: new Date()}],
    [`a dateRange object with no 'dateTo' property`, {dateFrom: new Date()}],
    [`a dateRange object with non-date objects for both 'dateTo' and 'dateFrom'`, {dateFrom: '', dateTo: ''}],
    [`a dateRange object with a non-date object for 'dateTo'`, {dateFrom: new Date(), dateTo: ''}],
    [`a dateRange object with a non-date object for 'dateFrom'`, {dateFrom: '', dateTo: new Date()}],
  ])('given %s, it should throw an InvalidArgumentError', async (desc, value) => {
    await expect(afpWireService.search(value)).rejects.toThrowError(InvalidArgumentError);
  });
});
