const wireAfpAdapter = require('../../../app/wireAfpAdapter');
const wireAfpItemTextMock = require('../../mocks/wireAfpItemText.json');
const efeWireContentWithAuthors = require('../../mocks/efeWireContentWithAuthors.json');
const afpAnsStory = require('../../mocks/afpAnsStoryText.json');

test('given valid AFP content, it should return a valid ANS story', () => {
  process.env.Env = 'stg'
  const result = wireAfpAdapter(wireAfpItemTextMock);

  expect(result).toEqual(afpAnsStory);
});

test('given an AFP content, it should return an ANS formatted' +
` content with a single author object which both name and org are "AFP".`, () => {
  const result = wireAfpAdapter(wireAfpItemTextMock);
  const { credits: { by: authors } } = result;
  expect(authors).toHaveLength(1);
  expect(authors[0].org).toEqual("AFP");
  expect(authors[0].name).toEqual("AFP");
});
