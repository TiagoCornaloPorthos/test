const { UnsentContentError } = require('../../../../app/errors');

test.todo('UnsentContentError::constructor');

describe('UnsentContentError::toJSON', () => {
  test('given no arguments, it should return the serialized version of the error', () => {
    const expectedErrorProperties = {
      name: UnsentContentError.name,
      message: 'Error description',
      source: 'source-text',
      contentId: 'content-id'
    };
    const error = new UnsentContentError(
      expectedErrorProperties.message,
      expectedErrorProperties.source,
      expectedErrorProperties.contentId
    );

    const result = error.toJSON();

    expect(result).toEqual(expect.objectContaining({
      ...expectedErrorProperties
    }));
  });
});
