const { MissingDependencyError, InvalidArgumentError } = require('../errors');
const config = require('../config')

class ContentService {
  constructor(fetch) {
    if (fetch === undefined) {
      throw new MissingDependencyError(`'fetch' dependency should be provided. Got: ${fetch}`);
    }
    this.fetch = fetch;
  }

  async search(website, body, sort, sourceInclude, sourceExclude) {
    throwErrorIfWebsiteIsInvalid(website);
    throwErrorIfBodyIsInvalid(body);
    throwErrorIfSortIsInvalid(sort);
    throwErrorIfSourceIncludeIsInvalid(sourceInclude);
    throwErrorIfSourceExcludeIsInvalid(sourceExclude);

    const params = {
      website,
      body: JSON.stringify(body),
      sort,
      _sourceInclude: sourceInclude,
      _sourceExclude: sourceExclude
    };
    const queryString = new URLSearchParams(params).toString();

    return this.fetch(`${config.hostUrl}/content/v4/search?${queryString}`, {
      method: 'get',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.auth.accessToken}`
      }
    });
  }
}

function throwErrorIfWebsiteIsInvalid(website) {
  if (typeof website !== 'string' || website.trim() === '') {
    throw new InvalidArgumentError(`'website' should be a valid search website. Got: ${website}`);
  }
}
function throwErrorIfBodyIsInvalid(body) {
  if (typeof body !== 'object' || JSON.stringify(body).trim() === '{}') {
    throw new InvalidArgumentError(`'body' should be a valid search body. Got: ${body}`);
  }
}

function throwErrorIfSortIsInvalid(sort) {
  const regexp = '';
  if (typeof sort !== 'string' || sort.trim() === '') {
    throw new InvalidArgumentError(`'sort' should be a valid sort. Got: ${sort}`);
  }
}

function throwErrorIfSourceIncludeIsInvalid(sourceInclude) {
  if (typeof sourceInclude !== 'string') {
    throw new InvalidArgumentError(`'sourceInclude' should be a valid source include. Got: ${sourceInclude}`);
  }
}

function throwErrorIfSourceExcludeIsInvalid(sourceExclude) {
  if (typeof sourceExclude !== 'string') {
    throw new InvalidArgumentError(`'sourceExclude' should be a valid source exclude. Got: ${sourceExclude}`);
  }
}

module.exports = ContentService;
