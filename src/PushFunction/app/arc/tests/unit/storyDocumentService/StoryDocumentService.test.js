const StoryDocumentService = require('../../../storyDocumentService/StoryDocumentService');
const { MissingDependencyError, InvalidArgumentError } = require('../../../errors');
const { createDocumentMock, createCirculationMock, createPublishedRevisionMock } = require('../../mocks');

describe('StoryDocumentService::constructor', () => {
  test('given no arguments, it should throw a MissingDependencyError', () => {
    expect(() => new StoryDocumentService()).toThrowError(MissingDependencyError);
  })
});

describe('StoryDocumentService::create', () => {
  test('given no arguments, it should return a document object', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce(createDocumentMock());
    const storyDocumentService = new StoryDocumentService(fetchMock);

    const result = await storyDocumentService.create({});

    expect(result).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        type: expect.any(String),
        created_at: expect.any(String),
        draft_revision_id: expect.any(String)
      })
    );
  });
});

describe('StoryDocumentService::createDraftRevisionForDocumentId', () => {
  test('given a document and ANS formatted content, it should return a revision object', async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce({
        id: '',
        document_id: '',
        created_at: '',
        type: '',
        user_id: '',
        ans: {}
      });
    const storyDocumentService = new StoryDocumentService(fetchMock);

    const result = await storyDocumentService.createDraftRevisionForDocumentId(createDocumentMock().id, {});

    expect(result).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        document_id: expect.any(String),
        created_at: expect.any(String),
        type: expect.any(String),
        user_id: expect.any(String),
        ans: expect.any(Object)
      })
    );
  });

  test.each([
    ['no arguments', []],
    ['an empty string as a document id', ['']],
    ['a string of spaces as a document id', ['   ']],
    ['a non-string as document id', [{}]],
    ['no ansFormattedContent', ['IAmAValidId']],
    ['an ansFormattedContent as an array', ['IAmAValidId', []]],
  ])(
    "given %s, it should throw an InvalidArgumentError",
    async (message, args) => {
      const storyDocumentService = new StoryDocumentService(()=>{});
      await expect(storyDocumentService.createDraftRevisionForDocumentId(...args))
        .rejects
        .toThrowError(InvalidArgumentError);
  });
});

describe('StoryDocumentService::circulate', () => {
  test('given a document id, it should return a circulation object', async () => {
    const circulationMock = createCirculationMock();
    const fetchMock = jest.fn().mockResolvedValueOnce(circulationMock);
    const storyDocumentService = new StoryDocumentService(fetchMock);
    const sectionsMock = { deep : 'deep', shallow : 'shallow' }


    const result = await storyDocumentService.circulate(createDocumentMock().id, sectionsMock);

    expect(result).toStrictEqual(circulationMock);
  });

  test.each([
    ['no arguments', []],
    ['an empty string as a document id', ['']],
    ['a string of spaces as a document id', ['   ']],
    ['a non-string as document id', [{}]]
  ])(
    "given %s, it should throw an InvalidArgumentError",
    async (message, args) => {
      const storyDocumentService = new StoryDocumentService(()=>{});
      await expect(storyDocumentService.circulate(...args))
        .rejects
        .toThrowError(InvalidArgumentError);
  });
});

describe('StoryDocumentService::publish', () => {
  test('given a document id, it should return a new published revision object', async () => {
    const publishedRevisionMock = createPublishedRevisionMock();
    const fetchMock = jest.fn().mockResolvedValue(publishedRevisionMock);
    const storyDocumentService = new StoryDocumentService(fetchMock);

    const result = await storyDocumentService.publish(createDocumentMock().id);

    expect(result).toStrictEqual(publishedRevisionMock);
  });

  test.each([
    ['no arguments', []],
    ['an empty string as a document id', ['']],
    ['a string of spaces as a document id', ['   ']],
    ['a non-string as document id', [{}]]
  ])(
    "given %s, it should throw an InvalidArgumentError",
    async (message, args) => {
      const storyDocumentService = new StoryDocumentService(()=>{});
      await expect(storyDocumentService.publish(...args))
        .rejects
        .toThrowError(InvalidArgumentError);
  });
});
