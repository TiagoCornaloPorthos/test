const fetch = require('/opt/nodejs/fetch');
const { InvalidArgumentError, MissingDependencyError } = require('../errors');

function createLoggedFetch(fetch, logger) {
  throwIfFetchIsInvalid(fetch);
  throwIfLoggerIsMissing(logger);
  return async (...args) => {
    const res = await fetch(...args);
    const arcRateLimit = {
      rateLimit: {
        remaining: res.headers.get('arcpub-ratelimit-remaining'),
        reset: res.headers.get('arcpub-ratelimit-reset')
      }
    };
    logger.info('Rate limit:',JSON.stringify(arcRateLimit));
    return res.json();
  };
}

function throwIfFetchIsInvalid(fetch) {
  if (typeof fetch !== 'function') {
    throw new InvalidArgumentError(`'fetch' should be a function. Got: ${fetch}`);
  }
}

function throwIfLoggerIsMissing(logger) {
  if (logger === undefined) {
    throw new MissingDependencyError(`'logger' dependency should be provided. Got: ${logger}`);
  }
}

module.exports = exports = createLoggedFetch(fetch, console);
exports.createLoggedFetch = createLoggedFetch;
