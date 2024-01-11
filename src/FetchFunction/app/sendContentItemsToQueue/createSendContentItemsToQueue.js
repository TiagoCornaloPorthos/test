const { InvalidArgumentError } = require('../errors');

function createSendContentItemsToQueue(sendContent) {
  if (typeof sendContent !== 'function') {
    throw new InvalidArgumentError(`'sendContent' should be a function. Got: ${sendContent}`);
  }

  return async function sendContentItemsToQueue(contents) {
    throwErrorIfContentsIsInvalid(contents);
    const settledPromises = await sendAMessageForEach(contents);
    return mapSettledPromisesToSendResults(settledPromises);
  };

  function sendAMessageForEach(contents) {
    return Promise.allSettled(contents.map(content => sendContent(content)));
  }
}

function throwErrorIfContentsIsInvalid(contentItems) {
  if (!(contentItems instanceof Array)) {
    throw new InvalidArgumentError(
      `'contentItems' should be an Array. Got: '${contentItems}'.`
    );
  }
}

function mapSettledPromisesToSendResults(settledPromises) {
  return settledPromises.map((settledPromise) => {
    if (settledPromise.status === 'fulfilled') {
      return {
        status: 'success',
        data: settledPromise.value
      };
    } else {
      return {
        status: 'error',
        data: settledPromise.reason.toJSON()
      };
    }
  });
}

module.exports = createSendContentItemsToQueue;
