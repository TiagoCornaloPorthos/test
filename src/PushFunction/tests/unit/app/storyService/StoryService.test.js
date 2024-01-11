const StoryService = require('../../../../app/storyService/StoryService');
const { InvalidArgumentError, MissingDependencyError } = require('../../../../app/errors');
const searchResultsMock = require('../../../mocks/searchResultsMock.json');
const publishedDocumentRevisionMock = require('../../../mocks/publishedDocumentRevisionMock.json');

const storyDocumentServiceMock = {
  create: jest.fn().mockResolvedValue({ id: '', created_at: '' }),
  createDraftRevisionForDocumentId: jest.fn().mockResolvedValue({ans:{last_updated_date:''}}),
  update: jest.fn().mockResolvedValue({ id: '' }),
  circulate: jest.fn().mockResolvedValue({}),
  publish: jest.fn().mockResolvedValue(publishedDocumentRevisionMock)
};
const contentApiServiceMock = {
  search: jest.fn().mockResolvedValue(searchResultsMock)
}
const storyService = new StoryService(storyDocumentServiceMock, contentApiServiceMock);

describe('StoryService::constructor', () => {
  test('given valid arguments, it should return an instance', () => {
    const result = new StoryService(() => { }, () => { });
    expect(result).toBeInstanceOf(StoryService);
  });

  test('given no arguments, it should throw an MissingDependencyError', () => {
    expect(() => new StoryService()).toThrowError(MissingDependencyError);
  });

  test('given only one argument, it should throw an MissingDependencyError', () => {
    expect(() => new StoryService(() => { })).toThrowError(MissingDependencyError);
  });

});

describe('StoryService::create', () => {
  test('given an ANS formatted content, it should create a story', async () => {
    const result = await storyService.create({});
    expect(result).toEqual({id: '', created_at: ''});
  });

  test('given no arguments, it should throw an InvalidArgumentError', async () => {
    await expect(storyService.create())
      .rejects
      .toThrowError(InvalidArgumentError);
  })
});

describe('StoryService::publish', () => {
  test('given an story id, it should return a published story revision with a publish date', async () => {
    const result = await storyService.publish('SZJ7YMV425E2RHVN3HZRSN5YZQ');
    expect(result).toEqual(publishedDocumentRevisionMock);
    expect(result).toEqual(expect.objectContaining({
      ans: expect.objectContaining({ publish_date: expect.any(String) })
    }));
  });
});

describe('StoryService::searchBySourceIds', () => {
  test('given an ANS formatted content, it should create a story', async () => {
    const recordsMock = [{
      messageAttributes: {
        Source: {
          dataType: "string",
          StringValue: "efeservicios"
        },
        ContentId: {
          dataType: "string",
          StringValue: "55004133865"
        }
      }
    }];
    const result = await storyService.searchBySourceIds(recordsMock);

    expect(result).toEqual([{"id": "DSVNLVHVKNFPVAYZWUEDAHGZJM", "lastUpdateDDate": "2020-07-15T20:15:08.934Z", "sourceId": "efeservicios-55004133865"}]);
  });
});
