const { MissingDependencyError } = require('../../../errors');
const { throwErrorIfWireIsInvalid } = require('../../../validations');
const format = require('date-fns/format');


module.exports = function(efeWireService) {
  throwIfMissingDependency(efeWireService);

  return async function(wire) {
    throwErrorIfWireIsInvalid(wire);

    const { config } = wire;
    const items = await efeWireService.getItemListByProductId(
      config.fetchCriteria.productId,
      formatDateToEFEDateFormat(config.dateFrom),
      formatDateToEFEDateFormat(config.dateTo)
    );
    const contents = items.map(item => ({
      source: wire.getMachineName(),
      id: item.packageInfo.id.toString(),
      publish: config.publish,
      data: item
    }));
    return contents;
  };
};

function throwIfMissingDependency(efeWireService) {
  if (efeWireService === undefined) {
    throw new MissingDependencyError(
      `'efeWireService' dependency should be provided. Got: ${efeWireService}`
    );
  }
}

function formatDateToEFEDateFormat(date) {
  return format(date, "yyyyMMdd'T'HHmmss").toString();
}
