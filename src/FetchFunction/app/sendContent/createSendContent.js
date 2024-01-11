const { InvalidArgumentError, MissingDependencyError, UnsentContentError } = require('../errors');

const AWS_QUEUE_URL = process.env.AWS_QUEUE_URL;

module.exports = function(queueService) {
  if (queueService === undefined) {
    throw new MissingDependencyError(
      `'queueService' dependency should be provided. Got: ${queueService}`
    );
  }
  return async function sendContent(content) {
    throwIfContentIsInvalid(content);
    const params = createParams(content);
    try {
      const res = await queueService.sendMessage(params).promise();
      return {
        source: content.source,
        contentId: content.id,
        publish: content.publish,
        messageId: res.MessageId
      };
    } catch (e) {
      throw new UnsentContentError(
        `Failed to send content id '${content.id}' with source '${content.source}'. Queue service threw Error ${e}` ,
        content.source,
        content.id
      );
    }
  };
}

function throwIfContentIsInvalid(content) {
  if (content === undefined
    || typeof content.id !== 'string'
    || typeof content.source !== 'string'
    || typeof content.publish !== 'boolean'
    || content.data === undefined
  ) {
    throw new InvalidArgumentError(`'content' should be a valid content ` +
      `{ id: <String>, source: <String>, publish: <Boolean>, data: <Anything> }. ` +
      `Got: ${JSON.stringify(content)}.`
    );
  }
}

function createParams(content) {
  const { source, id, publish, data } = content;
  return {
    QueueUrl: AWS_QUEUE_URL,
    MessageGroupId: source,
    MessageBody: JSON.stringify(data),
    MessageAttributes: {
      Source: {
        DataType: 'String',
        StringValue: source
      },
      ContentId: {
        DataType: 'String',
        StringValue: id
      },
      Publish: {
        DataType: 'Number',
        StringValue: publish ? '1':'0'
      }
    }
  };
}
