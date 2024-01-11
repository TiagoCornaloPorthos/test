const { UnexpectedHttpResponseStatusCodeError } = require('/opt/nodejs/fetch/errors');
const EFEWireService = require('../../../../../app/wires/efe/EFEWireService');
const { InvalidArgumentError, MissingDependencyError } = require('../../../../../app/errors');
const fetchMock = require('../../../../mocks/fetchMock');
const awsMock = require('../../../../mocks/awsMock');

describe('EFEWireService::constructor', () => {
  test('given no arguments, it should throw an MissingDependencyError', () => {
    expect(() => new EFEWireService()).toThrowError(MissingDependencyError);
  })
});

describe('EFEWireService::getItemListByProductId', () => {
  const wireService = new EFEWireService(fetchMock, awsMock);

  describe('given a valid productId, dateFrom and dateTo', () => {
    test('with content found, it should return an array of items', async () => {
      const result = await wireService.getItemListByProductId('12354','20200702T085332','20200702T194332');
      expect(result).toBeInstanceOf(Array);
    });

    test('with no content found, it should return an empty array of items', async () => {
      const fetchMock = jest.fn()
        .mockRejectedValueOnce(new UnexpectedHttpResponseStatusCodeError('error message', 404));
      const wireService = new EFEWireService(fetchMock, awsMock);

      const result = await wireService.getItemListByProductId('12354','20200702T085332','20200702T194332');

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });

    test('with an unexpected http error, it should throw an UnexpectedHttpResponseStatusCodeError', async () => {
      const fetchMock = jest.fn()
        .mockRejectedValueOnce(
          new UnexpectedHttpResponseStatusCodeError('error message', 500)
        );
      const wireService = new EFEWireService(fetchMock, awsMock);

      await expect(wireService.getItemListByProductId('12354','20200702T085332','20200702T194332'))
        .rejects
        .toThrowError(UnexpectedHttpResponseStatusCodeError);
    });
  });

  test.each([
    ['no arguments', []],
    ['only a productId argument', ['12345']],
    ['productId and dateFrom arguments', ['12345','20200702T085332']],
    ['an empty string as a product id', ['','20200732T085332','20200702T094332']],
    ['an empty string as a dateFrom', ['12345','','20200702T094332']],
    ['an empty string as a dateTo', ['12345','20200732T085332','']],
    ['a non-number string as productId', ['ABC','20200732T085332','20200702T094332']],
    ['an alphanumeric string as productId', ['123ABC','20200732T085332','20200702T094332']],
    ['negative number string as productId', ['-1','20200732T085332','20200702T094332']],
    ['float number string as productId', ['1.3','20200732T085332','20200702T094332']],
    ['negative float string as productId', ['-1.3','20200732T085332','20200702T094332']],
    ['zero integer as productId', [0,'20200732T085332','20200702T094332']],
    ['negative integer as productId', [-1,'20200732T085332','20200702T094332']],
    ['positive float as productId', [1.3,'20200732T085332','20200702T094332']],
    ['negative float as productId', [-1.3,'20200732T085332','20200702T094332']],
    ['an invalid date as dateFrom', ['12345','20200732T085332','20200702T094332']],
    ['an invalid date as dateTo', ['12345','20200702T085332','20200732T094332']],
    ['a Date instance as dateFrom', ['12345', new Date(2020, 7, 2, 8, 53, 32),'20200702T094332']],
    ['a Date instance as dateTo', ['12345', '20200702T085332', new Date(2020, 7, 2, 9, 43, 32)]],
  ])(
    "given %s, it should throw an InvalidArgumentError",
    async (message, args) => {
      await expect(wireService.getItemListByProductId(...args))
        .rejects
        .toThrowError(InvalidArgumentError);
  });
});
