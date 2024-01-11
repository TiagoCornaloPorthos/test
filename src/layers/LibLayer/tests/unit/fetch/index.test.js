const fetchFactory = require('../../../fetch/fetchFactory');
const { Response } = require('node-fetch');
const { UnexpectedHttpResponseStatusCodeError, InvalidArgumentError } = require('../../../fetch/errors');
const { createFetchMockWithResponseMock }  = require('../../mocks');

describe('given a valid argument', () => {
  test('with a 2xx response, it should return succesfully', async () => {
    const responseMock = new Response;
    const fetchMock = createFetchMockWithResponseMock(responseMock);
    const fetch = fetchFactory(fetchMock);

    const result = await fetch('some-url');

    expect(result).toBeInstanceOf(Response);
  });

  test('with a non-2xx response, it should throw an UnexpectedHttpResponseStatusCodeError', async () => {
    const responseMock = new Response('response body as text', {status: 400});
    const fetchMock = createFetchMockWithResponseMock(responseMock);
    const fetch = fetchFactory(fetchMock);

    await expect(fetch('some-url')).rejects.toThrow(UnexpectedHttpResponseStatusCodeError);
  });
});

