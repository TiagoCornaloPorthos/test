const { UnexpectedHttpResponseStatusCodeError } = require('/opt/nodejs/fetch/errors');
const { InvalidArgumentError, MissingDependencyError } = require('../../errors');
const {parse, isValid} = require('date-fns')
const config = {
  hostUrl: process.env.EFESERVICIOS_API_HOST_URL,
  auth: {
    clientId: process.env.EFESERVICIOS_API_CLIENT_ID,
    clientSecret: process.env.EFESERVICIOS_API_CLIENT_SECRET
  }
};
const tokensTable = process.env.AWS_TOKENS_TABLE_NAME;

class EFEWireService {
  constructor(fetch, docClient) {
    if (fetch === undefined) {
      throw new MissingDependencyError(`'fetch' dependency should be provided. Got: ${fetch}`);
    }
    if (docClient === undefined) {
      throw new MissingDependencyError(`'docClient' dependency should be provided. Got: ${docClient}`);
    }

    /** @private */
    this.fetch = fetch;
    /** @private */
    this.token = '';
    /** @private */
    this.docClient = docClient
  }

  async getItemListByProductId(productId, dateFrom, dateTo) {
    if (!isProductIdValid(productId)) {
      throw new InvalidArgumentError(
        `'productId' should be a positive integer as a string. Got: '${productId}'.`
      );
    }
    if (!isDateValid(dateFrom)) {
      throw new InvalidArgumentError(
        `'dateFrom' should be a date as a string. Got: '${dateFrom}'.`
      );
    }
    if (!isDateValid(dateTo)) {
      throw new InvalidArgumentError(
        `'dateTo' should be a date as a string. Got: '${dateTo}'.`
      );
    }

    this.token = await this.fetchAccessToken();
    const items = await this.fetchItemListByProductId(productId, dateFrom, dateTo);
    return items;
  }

    /** @private */
    async fetchAccessToken() {
      const params = {
        TableName: tokensTable,
        Key: {
            "TokenId": "EFE",
          }
        };

      const token = await this.docClient.get(params).promise()
      return token.Item.content
    }

  /** @private */
  async fetchItemListByProductId(productId, dateFrom, dateTo) {
    let items;
    try {
      const queryString = buildQueryString(productId, dateFrom, dateTo);
      ({ data: { items } } = await this.fetch(`${config.hostUrl}/content/items_ByProductId?${queryString}`, {
        headers: {
          accept: 'application/json',
          'x-apiversion': '1.0',
          Authorization: `Bearer ${this.token}`
        }
      }));
    } catch (error) {
      if (error instanceof UnexpectedHttpResponseStatusCodeError
        && error.status === 404
      ) {
        items = []
      } else {
        throw error;
      }
    }
    return items;
  }
}

function isProductIdValid(productId) {
  return productId !== undefined
    && typeof productId === 'string'
    && isIntegerNumberString(productId)
    && Number.parseInt(productId) > 0;
}

function isIntegerNumberString(string) {
  if (typeof string !== 'string') {
    throw new InvalidArgumentError(
      `'string' should be of type string. Got: '${string}'.`
    );
  }
  const parsedString = Number.parseInt(string, 10);
  return string === parsedString.toString();
}

function isDateValid(date) {
  return date !== undefined
    && typeof date === 'string'
    && isDateString(date);
}

function isDateString(string) {
  if (typeof string !== 'string') {
    throw new InvalidArgumentError(
      `'string' should be of type string. Got: '${string}'.`
    );
  }
  const date = parse(string, "yyyyMMdd'T'HHmmss", new Date());

  return isValid(date);
}

function buildQueryString(productId, dateFrom, dateTo) {
  return (new URLSearchParams({
    product_id: productId,
    sort: 'desc',
    date_from: dateFrom,
    date_to: dateTo,
    start_itemId: 0,
    page: 0,
    page_size: '500',
    lang_code: 'ES',
    format: 'json'
  })).toString();
}

module.exports = EFEWireService;
