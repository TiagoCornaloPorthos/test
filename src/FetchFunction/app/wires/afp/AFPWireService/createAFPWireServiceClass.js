const { InvalidArgumentError } = require('../../../errors');

const config = {
  hostUrl: process.env.AFP_API_HOST_URL,
};

async function createAFPWireServiceClass(fetch, getToken) {
  throwIfArgumentsAreInvalid(arguments, ['fetch', 'getToken']);

  const token = await getToken('AFP_TOKEN');

  return class AFPWireService {
    async search(dateRange = {}) {
      throwIfDateRangeIsInvalid(dateRange);

      const { response: { docs = [] } } = await fetch(`${config.hostUrl}/v1/api/search?wt=xml`, {
        method: 'post',
        body: JSON.stringify(buildQuery(dateRange)),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      return docs;
    }
  };
}

function throwIfArgumentsAreInvalid(args, argsNames) {
  argsNames.forEach((name, i) => {
    if (typeof args[i] !== 'function') {
      throw new InvalidArgumentError(`'${name}' should be a function. Got: ${args[i]}`);
    }
  });
}

function throwIfDateRangeIsInvalid(dateRange) {
  if (typeof dateRange !== 'object'
    || !(dateRange.dateFrom instanceof Date)
    || !(dateRange.dateTo instanceof Date)
  ) {
    throw new InvalidArgumentError(`'dateRange' should be an object with the` +
      ` following structure: { dateFrom: <Date>, dateTo: <Date> }.` +
      ` Got: ${JSON.stringify(dateRange)}`
    );
  }
}

function buildQuery(dateRange) {
  const { dateFrom, dateTo } = dateRange;

  return {
    lang: 'es',
    dateRange: {
      from: formatToAFPDateFormat(dateFrom),
      to: formatToAFPDateFormat(dateTo)
    },
    query: {
      name: 'product',
      and: 'news'
    }
  };
}

function formatToAFPDateFormat(date) {
  return date.toISOString();
}

module.exports = createAFPWireServiceClass;
