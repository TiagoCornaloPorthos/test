const createDocumentMock = require('./createDocumentMock');
const createCirculationMock = require('./createCirculationMock');
const createPublishedRevisionMock = require('./createPublishedRevisionMock');
const fetchMocks = require('./fetch-mocks');
const searchResultsMock = require('./searchResultsMock');

module.exports = {
  createDocumentMock,
  createCirculationMock,
  createPublishedRevisionMock,
  searchResultsMock,
  ...fetchMocks
};
