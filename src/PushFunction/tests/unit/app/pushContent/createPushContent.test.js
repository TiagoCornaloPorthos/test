const createPushContent = require('../../../../app/pushContent/createPushContent');
const { MissingDependencyError } = require('../../../../app/errors');

test('given valid arguments, it should return a function', () => {
  const result = createPushContent(()=> {}, () => {}, () => {}, () => {}, () => {}, {});
  expect(result).toBeInstanceOf(Function);
});

test.each([
  ['no arguments', []],
  ['1 argument', [() => {}]],
])('given %s, it should throw an MissingDependencyError', (message, dependencies) => {
  expect(() => createPushContent(...dependencies)).toThrowError(MissingDependencyError);
});
