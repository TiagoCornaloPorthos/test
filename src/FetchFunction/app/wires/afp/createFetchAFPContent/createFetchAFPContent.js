const { MissingDependencyError } = require('../../../errors');
const { throwErrorIfWireIsInvalid } = require('../../../validations');

module.exports = function(afpWireService) {
  throwIfMissingDependency(afpWireService);

  return async function(wire) {
    throwErrorIfWireIsInvalid(wire);

    const { config } = wire;
    const documents = await afpWireService.search({
      dateFrom: config.dateFrom,
      dateTo: config.dateTo
    });
    const contents = documents.map(document => ({
      source: wire.getMachineName(),
      id: document.newsItemID,
      publish: config.publish,
      data: document
    }));
    return contents;
  };
};

function throwIfMissingDependency(afpWireService) {
  if (afpWireService === undefined) {
    throw new MissingDependencyError(
      `'afpWireService' dependency should be provided. Got: ${afpWireService}`
    );
  }
}
