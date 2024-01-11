const { MissingDependencyError, InvalidArgumentError } = require('../errors');
const config = require('../config');

const WEBSITE_ID = 'tn';

class StoryDocumentService {
  constructor(fetch) {
    if (fetch === undefined) {
      throw new MissingDependencyError(`'fetch' dependency should be provided. Got: ${fetch}`);
    }
    this.fetch = fetch;
  }

  async create(ansFormattedContent) {
    throwErrorIfAnsFormattedContentIsInvalid(ansFormattedContent);

    return this.fetch(`${config.hostUrl}/draft/v1/story`, {
      method: 'post',
      body: JSON.stringify(ansFormattedContent),
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.auth.accessToken}`
      }
    });
  }

  async createDraftRevisionForDocumentId(id, ansFormattedContent) {
    throwErrorIfDocumentIdIsInvalid(id);
    throwErrorIfAnsFormattedContentIsInvalid(ansFormattedContent);

    return this.fetch(`${config.hostUrl}/draft/v1/story/${id}/revision/draft`, {
      method: 'put',
      body: JSON.stringify({ document_id: id, ans: ansFormattedContent, type: 'DRAFT'}),
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.auth.accessToken}`
      }
    });
  }

  async circulate(id, sections) {
    throwErrorIfDocumentIdIsInvalid(id);
    return this.fetch(`${config.hostUrl}/draft/v1/story/${id}/circulation/${WEBSITE_ID}?collision_behavior=increment`, {
      method: 'put',
      body: JSON.stringify(createCirculationForDocument(id, sections)),
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.auth.accessToken}`
      }
    });
  }

  async publish(id) {
    throwErrorIfDocumentIdIsInvalid(id);
    return this.fetch(`${config.hostUrl}/draft/v1/story/${id}/revision/published?collision_behavior=increment`, {
      method: 'post',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.auth.accessToken}`
      }
    });
  }
}

function throwErrorIfDocumentIdIsInvalid(id) {
  if (typeof id !== 'string' || id.trim() === '') {
    throw new InvalidArgumentError(`'id' should be a valid document id. Got: ${id}`);
  }
}

function throwErrorIfAnsFormattedContentIsInvalid(ansFormattedContent) {
  if (!ansFormattedContent || ansFormattedContent instanceof Array) {
    throw new InvalidArgumentError(`'ansFormattedContent' should be an object. Got: ${ansFormattedContent}`);
  }
}

function createCirculationForDocument(documentId, sections) {
  const deep = createSectionWithId(sections.deep);
  const shallow = createSectionWithId(sections.shallow);
  return {
    document_id: documentId,
    website_id: WEBSITE_ID,
    website_primary_section: deep,
    website_sections: [
      deep,
      shallow
    ]
  };
}

function createSectionWithId(sectionId) {
  return {
    type: 'reference',
    referent: {
      type: 'section',
      id: sectionId,
      website: WEBSITE_ID
    }
  };
}

module.exports = StoryDocumentService;
