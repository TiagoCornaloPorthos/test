function createFetchMockWithResponseMock(responseMock) {
  return jest.fn().mockResolvedValue(responseMock);
}

function createFetchMockWithJsonMock(jsonFunctionMock) {
  return createFetchMockWithResponseMock({ json: jsonFunctionMock });
}

module.exports = {
  createFetchMockWithJsonMock,
  createFetchMockWithResponseMock
};
