const createSendContent = require('../../../../app/sendContent/createSendContent');
const { InvalidArgumentError, UnsentContentError } = require('../../../../app/errors');

const promiseMock = jest.fn();
const queueServiceMock = {
  sendMessage: () => ({ promise: promiseMock })
};
const sendContent = createSendContent(queueServiceMock)

beforeEach(() => promiseMock.mockReset());

describe('given a valid a content', () => {
  const content = {id: '123', source: 'sourcevalue', publish: true, data: {}};

  test('it should return a send content response object', async () => {
    promiseMock.mockResolvedValue({
      "ResponseMetadata": {
        "RequestId": "8323c7b8-1494-5f60-9102-90c6c8c162e9"
      },
      "MD5OfMessageBody": "54782fa1f00d29234313e10e565d536f",
      "MessageId": "562b35c7-79ee-45d4-a0de-bdd1d7608332",
      "SequenceNumber": "18854847368121072384"
    });

    const result = await sendContent(content);

    expect(result).toMatchObject(expect.objectContaining({
      source: content.source,
      contentId: content.id,
      publish: content.publish,
      messageId: expect.any(String)
    }));
  });
  test('if an error occurs, it should throw an UnsentContentError', async () => {
    promiseMock.mockRejectedValue(new Error());
    await expect(sendContent(content)).rejects.toThrowError(UnsentContentError);
  });
});

test.each([
  ['no arguments', undefined],
  ['a content with no id', { source: '', data: {}, publish: true }],
  ['a content with no source', { id: '', data: {}, publish: true }],
  ['a content with no data', { id: '', source: '', publish: true }],
  ['a content with non-string id', { id: 12, source:'', publish: true, data: {} }],
  ['a content with non-string source', { id: '', source: {}, publish: true, data: {} }],
  ['a content with non-boolean publish', { id: '', source: '', publish: 'true', data: {} }]
])('given %s, it should throw an InvalidArgumentError',
  async (message, arg) => {
    await expect(sendContent(arg))
      .rejects
      .toThrowError(InvalidArgumentError);
});
