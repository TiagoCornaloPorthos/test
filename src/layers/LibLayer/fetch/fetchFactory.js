const { InvalidArgumentError, UnexpectedHttpResponseStatusCodeError } = require('./errors');

module.exports = function(fetch) {
  if (typeof fetch !== 'function') {
    throw new InvalidArgumentError(`'fetch' should be a function. Got: ${fetch}`);
  }
  return async function(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new UnexpectedHttpResponseStatusCodeError(
        await createErrorMessage(res, { options, url }),
        res.status
      );
    }
    return res;
  }
};

async function createErrorMessage(res, req) {
  const method = req.options.method || 'get';
  let message = `Response: ${res.status} ${res.statusText}.`
    + `\nResponse body: ${await res.text()}`
    + `\nRequest: ${method.toUpperCase()} ${req.url}`
  ;
  if (req.options.body !== undefined) {
    message += `\nRequest body: ${req.options.body}`;
  }
  return message;
}
