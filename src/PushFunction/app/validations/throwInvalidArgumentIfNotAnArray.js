const { InvalidArgumentError } = require('../errors');

function throwInvalidArgumentIfNotAnArray(argument, argumentName = 'Argument') {
  if (!(argument instanceof Array)) {
    throw new InvalidArgumentError(
      `'${argumentName}' should be an Array. Got: '${argument}'.`
    );
  }
}

module.exports = throwInvalidArgumentIfNotAnArray;
