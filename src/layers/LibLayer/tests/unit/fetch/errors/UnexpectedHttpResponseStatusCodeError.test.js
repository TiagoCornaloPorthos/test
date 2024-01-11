const { UnexpectedHttpResponseStatusCodeError } = require('../../../../fetch/errors');

describe('UnexpectedHttpResponseStatusCodeError::constructor', () => {
  test.each`
  desc           | arg          | expected
  ${'no status'} | ${undefined} | ${undefined}
  ${'a status'}  | ${404}     | ${404}
  `(`given $desc, it should return an instance with a status value of '$expected'`, ({ arg, expected }) => {
    const result = new UnexpectedHttpResponseStatusCodeError('', arg);
    expect(result.status).toBe(expected);
  });
});

describe('UnexpectedHttpResponseStatusCodeError::toJSON', () => {
  test('given no arguments, it should return the serialized version of the error', () => {
    const expectedHttpStatusCode = 404;
    const error = new UnexpectedHttpResponseStatusCodeError(
      '',
      expectedHttpStatusCode
    );
    const result = error.toJSON();
    expect(result).toEqual(expect.objectContaining({
      name: expect.any(String),
      message: expect.any(String),
      status: expectedHttpStatusCode
    }));
  });
});
