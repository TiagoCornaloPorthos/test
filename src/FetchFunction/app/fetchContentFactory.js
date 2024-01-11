const Wire = require('./Wire');
const { createFetchAFPContent, createFetchEFEContent } = require('./wires');
const { InvalidArgumentError } = require('./errors');
const { throwErrorIfWireIsInvalid } = require('./validations');

const fetchAdapterFactoryFunctions = {
  [Wire.EFESERVICIOS]: createFetchEFEContent,
  [Wire.AFP]: createFetchAFPContent
};

module.exports = async function(wire) {
  throwErrorIfWireIsInvalid(wire);

  const fetchAdapterFunction = await fetchAdapterFactoryFunctions[wire.getMachineName()]();
  if (fetchAdapterFunction) {
    return fetchAdapterFunction.bind(null, wire);
  }

  throw new InvalidArgumentError(
    `'wire' should be one of ['${Object.keys(fetchAdapterFactoryFunctions).join(`', '`)}' ].` +
    ` Got: '${wire.getMachineName()}'.`
  );
}
