const { InvalidArgumentError, MissingDependencyError } = require('../errors');
const { isAfter, parseISO } = require("date-fns");

class StoryService {
  constructor(storyDocumentService, contentService) {
    if (storyDocumentService === undefined) {
      throw new MissingDependencyError(`'storyDocumentService' should be provided. Got: ${storyDocumentService}`);
    }
    if (contentService === undefined) {
      throw new MissingDependencyError(`'contentService' should be provided. Got: ${contentService}`);
    }
    this.storyDocumentService = storyDocumentService;
    this.contentService = contentService;
  }

  async create(ansFormattedContent) {
    if (ansFormattedContent === undefined) {
      throw new InvalidArgumentError(`'ansFormattedContent' should be provided. Got: ${ansFormattedContent}`);
    }
    const document = await this.storyDocumentService.create(ansFormattedContent);
    return { id: document.id , created_at: document.created_at}
  }

  async publish(id) {
    return this.storyDocumentService.publish(id);
  }

  async circulate(id, sections) {
    await this.storyDocumentService.circulate(id, sections);

  }

  async searchBySourceIds(sourceIds) {
    const termQueries = sourceIds.map(sourceId => ({
      term: {
        'source.source_id': sourceId
      }
    }));
    const params = {
      website: "tn",
      body: {
        query: {
          bool: {
            should: termQueries
          }
        }
      },
      sort: 'last_updated_date:desc',
      sourceInclude: '_id,created_date,last_updated_date, source',
      sourceExclude: 'slug,canonical_website,headlines,subheadlines,description,credits,display_date,publishing,location,headlinesdescription,language,label,type,subtype,version,distributor,cannonical_website,taxonomy,websites,planning,related_content,additional_properties,owner,content_elements,copyright,address,workflow'
    };

    return this.contentService.search(params.website, params.body, params.sort, params.sourceInclude, params.sourceExclude)
      .then(results => {
        const { content_elements, additional_properties, count } = results;
        return content_elements.map((result) => {
          const { source: { source_id }, last_updated_date, _id } = result;
          return {
            sourceId: source_id,
            lastUpdateDDate: last_updated_date,
            id: _id
          }
        })
      })
  }

}

module.exports = StoryService;
