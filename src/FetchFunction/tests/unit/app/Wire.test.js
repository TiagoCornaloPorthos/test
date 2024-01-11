const Wire = require('../../../app/Wire');
const { InvalidArgumentError } = require('../../../app/errors');
const { efeWireEventMock } = require('../../mocks/efe');

describe('Wire::constructor', () => {
  test.each([
    [efeWireEventMock],
  ])(`given a valid wire event, it should return a Wire instance`, (wireEvent) => {
    const result = new Wire(wireEvent);
    expect(result).toBeInstanceOf(Wire);
  });

  test.each([
    ['no argument', undefined],
    ['an invalid wire machine name', 'invalidwiremachinename']
  ])('given %s, it should throw an InvalidArgumentError', (desc, value) => {
    expect(() => ( new Wire(value) )).toThrowError(InvalidArgumentError);
  });
});

describe('Wire::getMachineName', () => {
  test('given no arguments, it should return a machine name as a string', () => {
    const wire = new Wire(efeWireEventMock);
    const result = wire.getMachineName();
    expect(result).toBe(efeWireEventMock.name);
  });
});

describe('Wire::getMachineName', () => {
  test('given no arguments, it should return a machine name as a string', () => {
    const wire = new Wire(efeWireEventMock);
    const result = wire.getMachineName();
    expect(result).toBe(efeWireEventMock.name);
  });
});

describe('Wire::config getter', () => {
  test('it should return a config object by value', () => {
    const wire = new Wire(efeWireEventMock);
    const expected = wire.config;

    const result = wire.config;

    expect(result).not.toBe(expected);
    expect(result).toEqual(expected);
  });
});

describe('Wire::toJSON', () => {
  test('given no arguments, it should return the serialized version of a wire object', () => {
    const dateFormatRegex = /^\d{8}T\d{6}$/;
    const wire = new Wire(efeWireEventMock);

    const result = JSON.parse(JSON.stringify(wire));

    expect(result).toEqual(expect.objectContaining({
      machineName: expect.any(String),
      config: expect.objectContaining({
        publish: expect.any(Boolean),
        fetchCriteria: expect.any(Object),
        dateFrom: expect.stringMatching(dateFormatRegex),
        dateTo: expect.stringMatching(dateFormatRegex)
      })
    }));
  });
});
