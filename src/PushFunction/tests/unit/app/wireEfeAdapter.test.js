const wireEfeAdapter = require('../../../app/wireEfeAdapter');
const wireEfeItemTextMock = require('../../mocks/wireEfeItemText.json');
const efeWireContentWithAuthors = require('../../mocks/efeWireContentWithAuthors.json');
const ansStory = require('../../mocks/ansStoryText.json');

test('given valid content, it should valid ANS story', () => {
  process.env.Env = 'stg'
  const result = wireEfeAdapter(wireEfeItemTextMock);

  expect(result).toEqual(ansStory);
});

test('given an EFE content, it should return an ANS formatted' +
` content with a single author object which both name and org are "Agencia EFE".`, () => {
  const result = wireEfeAdapter(wireEfeItemTextMock);
  const { credits: { by: authors } } = result;
  expect(authors).toHaveLength(1);
  expect(authors[0].org).toEqual("Agencia EFE");
  expect(authors[0].name).toEqual("Agencia EFE");
});
