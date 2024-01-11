const { MissingDependencyError } = require('./errors');

const validateDependencies = function (dependencies) {
  ['filterOutDuplicatedContent', 'pushContent', 'logger'].forEach((dependency, i) => {
    if (!dependencies[i])
      throw new MissingDependencyError(
        `'${dependency}' dependency should be provided. Got: ${dependencies[i]}`
      );
  });
}

module.exports = function (filterOutDuplicatedContent, pushContent, logger) {
  validateDependencies(arguments);
  return async function (event, context) {
    const { Records: records } = event;
    const contents = mapSQSRecordsToContents(records);
    logger.info('Contents received:', contents.map(mapContentToLoggedContent));
    const contentsToPush = await filterOutDuplicatedContent(contents);
    logger.info('Contents to be pushed:', contentsToPush.map(mapContentToLoggedContent));
    const settledPromises =  await Promise.allSettled(
      contentsToPush.map(content => pushContent(content))
    );
    logger.info('Contents creation results:', contentsToPush.map(
      (content, index) => ({
        sourceId : content.sourceId ,
        publish : content.publish ,
        result : JSON.stringify(settledPromises[index])
      })
    ));
  };
}

function mapSQSRecordsToContents(records) {
  return records.map(({
    messageAttributes: {
      Source,
      ContentId,
      Publish
    },
    body
  }) => ({
    source: getStringValueFromMessageAttribute(Source),
    sourceId: `${getStringValueFromMessageAttribute(Source)}-${getStringValueFromMessageAttribute(ContentId)}`,
    publish: !!parseInt(getStringValueFromMessageAttribute(Publish)),
    data: body
  }));

  function getStringValueFromMessageAttribute(SQSMessageAttribute) {
    return SQSMessageAttribute.StringValue || SQSMessageAttribute.stringValue;
  }
}

function mapContentToLoggedContent({ sourceId, publish }) {
  return {
    sourceId,
    publish
  };
}
