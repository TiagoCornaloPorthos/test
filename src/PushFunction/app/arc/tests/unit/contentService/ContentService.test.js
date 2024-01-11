const ContentService = require('../../../contentService/ContentService');
const { MissingDependencyError, InvalidArgumentError } = require('../../../errors');
const { searchResultsMock } = require('../../mocks');

describe('ContentService::constructor', () => {
  test('given no arguments, it should throw a MissingDependencyError', () => {
    expect(() => new ContentService()).toThrowError(MissingDependencyError);
  })
});

describe('ContentService::search', () => {
  test('given no arguments, it should return a results object', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce(searchResultsMock());
    const contentService = new ContentService(fetchMock);

    const args = ["tn", {"query":{}},'fecha:desc','',''];
    const results = await contentService.search(...args);

    const content_elements = [{
      "created_date": "2020-07-15T20:15:08.013Z",
      "last_updated_date": "2020-07-15T20:15:08.934Z",
      "_id": "DSVNLVHVKNFPVAYZWUEDAHGZJM",
      "source": {
        "source_id": "efeservicios-55004133865"
      }
    }];
    const additional_properties = {
      "took": 7,
      "timed_out": false
    };
    expect(results).toStrictEqual(
      expect.objectContaining({
        type: expect.stringContaining('results'),
        version: expect.any(String),
        content_elements: expect.arrayContaining(content_elements),
        additional_properties: expect.objectContaining(additional_properties),
        count: expect.any(Number)
      })
    );
  });

  test.each([
    ['no arguments', []],
    ['an empty string as a website', ['',{"query":{}},'fecha:desc','','']],
    ['an empty string as a body', ['tn','',3232,'','']],
    ['an empty string as a sort', ['tn',{"query":{}}, '', '','']],
    ['an sourceInclude as an array', ['tn',{"query":{}}, 'fecha:desc', [],'']],
    ['an sourceExclude as an array', ['tn',{"query":{}}, 'fecha:desc', '',[]]],
  ])(
    "given %s, it should throw an InvalidArgumentError",
    async (message, args) => {
      const contentService = new ContentService(() => {});
      await expect(contentService.search(...args))
        .rejects
        .toThrowError(InvalidArgumentError);
    });
});
