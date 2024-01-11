const { MissingDependencyError }  = require('./errors');
const Wire = require('./Wire');

function app(fetchContentFactory, sendContentItemsToQueue, logger) {
  validateDependencies(arguments);

  return async function(event) {
    const wire = new Wire(event);
    const fetchContent = await fetchContentFactory(wire);
    const contents = await fetchContent();
    logger.info('Fetched wire content:', JSON.stringify({ wire, contents: contents.map(content => content.id) }));
    const sendResults = await sendContentItemsToQueue(contents);
    logger.info('Sent content results:', JSON.stringify(sendResults));
  };
}

function validateDependencies(dependencies) {
  ['fetchContentFactory', 'sendContentItemsToQueue', 'logger'].forEach((dependency, i) => {
    if (!dependencies[i])
      throw new MissingDependencyError(
        `'${dependency}' dependency should be provided. Got: ${dependencies[i]}`
      );
  });
}

module.exports = app;
