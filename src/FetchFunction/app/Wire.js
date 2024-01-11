const { InvalidArgumentError } = require('./errors');
const clone = require('rfdc')();
const format = require('date-fns/format');

const EFESERVICIOS = 'efeservicios';
const AFP = 'afp';
const WIRE_MACHINE_NAMES = [
  EFESERVICIOS,
  AFP
];

class Wire {
  static EFESERVICIOS = EFESERVICIOS;
  static AFP = AFP;

  #machineName
  #config

  constructor(wireEvent = {}) {
    if (!isMachineNameValid(wireEvent.name)) {
      throw new InvalidArgumentError(
        `'wireEvent.name' should be one of ${JSON.stringify(WIRE_MACHINE_NAMES)}. Got: '${wireEvent.name}'.`
      );
    }
    this.#machineName = wireEvent.name;
    this.#config = {
      ...clone(wireEvent.config),
      ...getDateRange()
    };
  }

  getMachineName() {
    return this.#machineName;
  }

  get config() {
    return clone(this.#config);
  }

  toJSON() {
    return {
      machineName: this.#machineName,
      config: {
        ...this.#config,
        dateFrom: formatToLoggedDateFormat(this.#config.dateFrom),
        dateTo: formatToLoggedDateFormat(this.#config.dateTo)
      }
    };
  }
}

function isMachineNameValid(machineName) {
  return (
    typeof machineName === 'string'
    && WIRE_MACHINE_NAMES.includes(machineName)
  );
}

function getDateRange() {
  const dateTo = new Date();
  const dateFrom = new Date(dateTo - (5 * 60000));
  return {
    dateFrom,
    dateTo
  }
}

function formatToLoggedDateFormat(date) {
  return format(date, "yyyyMMdd'T'HHmmss");
}

module.exports = Wire;
