const createPushContent = require('../../../../app/pushContent/createPushContent');
const { InvalidArgumentError } = require('../../../../app/errors');

const storyMock = {id: 'some-id'};
const storyServiceMock = {
  create: jest.fn().mockResolvedValue(storyMock),
  publish: jest.fn().mockResolvedValue({ ans: { publish_date: '2020-09-28T22:20:04.487Z' }}),
  circulate: () => {}
};
const pushContent = createPushContent(() => {}, () => {}, () => {}, () => {}, () => {}, storyServiceMock);

test('given a content to not be published  , it should return a push result without a publish date', async () => {
  const result = await pushContent({data: '{"packageInfo": {"format": {"description": "text"}}}', publish: false });
  expect(result).toEqual(expect.not.objectContaining({
    publish_date: expect.any(String)
  }));
});

test('given a content to be published, it should return a push result with a publish date', async () => {
  const result = await pushContent({data: '{"packageInfo": {"format": {"description": "text"}}}', publish: true });
  expect(result).toEqual(expect.objectContaining({
    publish_date: expect.any(String)
  }));
});
