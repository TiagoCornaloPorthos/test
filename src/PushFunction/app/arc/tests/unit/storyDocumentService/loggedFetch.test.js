const { createLoggedFetch } = require('../../../storyDocumentService/loggedFetch');
const { MissingDependencyError, InvalidArgumentError } = require('../../../errors');
const { createFetchMockWithResponseMock } = require('../../mocks');

describe('createLoggedFetch', () => {
  test('given valid arguments, it should return a function', () => {
    const result = createLoggedFetch(() => {}, {});
    expect(result).toBeInstanceOf(Function);
  });

  test.each([
    ['no arguments',                               InvalidArgumentError.name,   [],         InvalidArgumentError],
    ['a non-function value as the first argument', InvalidArgumentError.name,   [{}],       InvalidArgumentError],
    ['no value as the second argument',            MissingDependencyError.name, [() => {}], MissingDependencyError],
  ])('given %s, it should throw an %s', (message, errorName, dependencies, errorConstructor) => {
    expect(() => createLoggedFetch(...dependencies)).toThrowError(errorConstructor);
  });
});

describe('loggedFetch', () => {
  test('given valid argument, it should return an object', async () => {
    const fetchMock = createFetchMockWithResponseMock({
      headers: { get: () => {} },
      json: () => Promise.resolve({})
    });
    const loggerMock = { info: () => {} };
    const loggedFetch = createLoggedFetch(fetchMock, loggerMock);

    const result = await loggedFetch('some-url');

    expect(result).toBeInstanceOf(Object);
  });
});
