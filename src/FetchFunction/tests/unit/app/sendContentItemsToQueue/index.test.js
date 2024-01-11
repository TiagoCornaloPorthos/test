const createSendContentItemsToQueue = require('../../../../app/sendContentItemsToQueue/createSendContentItemsToQueue');
const { InvalidArgumentError } = require('../../../../app/errors');
const Wire = require('../../../../app/Wire');

const sendContent = jest.fn();
const sendContentItemsToQueue = createSendContentItemsToQueue(sendContent);

beforeEach(() => sendContent.mockReset());

test('given an empty array for content items, it should return an empty array', async () => {
  const result = await sendContentItemsToQueue([]);
  expect(result).toBeInstanceOf(Array);
  expect(result).toHaveLength(0);
});

test('given an array of contents, every object returned in the array ' +
  'should be a send result object',
  async () => {
    sendContent.mockResolvedValue({})
      .mockRejectedValueOnce({toJSON: () => ({})})
    ;
    const contents = [{},{}];
    const result = await sendContentItemsToQueue(contents);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(contents.length);
    result.forEach(content => expect(content).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching(/success|error/),
        data: {}
      })
    ));
  }
);

test.each([
  ['no arguments', []],
  ['a non-Array value', [{}]],
])('given %s, it should throw an InvalidArgumentError',
  async (message, args) => {
    await expect(sendContentItemsToQueue(...args))
      .rejects
      .toThrowError(InvalidArgumentError);
});
