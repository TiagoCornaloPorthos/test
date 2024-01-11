const Wire = require('../Wire');
const { InvalidArgumentError } = require('../errors');

function throwErrorIfWireIsInvalid(wire) {
  if (!(wire instanceof Wire)) {
    throw new InvalidArgumentError(`'wire' should be an instance of 'Wire'.`);
  }
}

module.exports = throwErrorIfWireIsInvalid;
