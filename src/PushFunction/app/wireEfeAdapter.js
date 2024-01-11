const { parse, format } = require("date-fns");
const placeholders = require("./mediaPlaceholders/EFE");

const WIRE_NAME = 'Agencia EFE';

module.exports = function wireEfeAdapter(content, image) {
  const env = process.env.Env;
  const placeholderObj = placeholders[env]
  let created_date = parse(content.packageInfo.firstCreated, "yyyyMMdd'T'HHmmss'Z'", new Date());
  let last_updated_date = parse(content.packageInfo.date, "yyyyMMdd'T'HHmmss'Z'", new Date());
  return {
    canonical_website: "tn",
    content_elements: content.packageInfo.text.split('\n').map((text) => {
      return {
        content: text,
        type: "text"
      }
    }),
    created_date: format(created_date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z"),
    credits: {
      by:[
        {
          name: WIRE_NAME,
          org: WIRE_NAME,
          type: "author"
        }
      ]
    },
    description: {
      basic: content.packageInfo.summary
    },
    display_date: format(created_date, "yyyy-MM-dd'T'HH:mm:ss'Z"),
    headlines: {
      basic: content.packageInfo.title
    },
    language: content.packageInfo.metaData.langCode,
    last_updated_date: format(last_updated_date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z"),
    source: {
      source_id: 'efeservicios-'+content.packageInfo.id,
      source_type: "wires",
      system: "artear i/o"
    },
    subheadlines: {
      basic: content.packageInfo.subtitle
    },
    promo_items:
      {
        basic: image ? image : placeholderObj
      },
    taxonomy: {
      tags: [
        {
          description: "EFE",
          slug: "efe",
          text: "EFE"
        }
      ]
    },
    type: "story",
    subtype: "article",
    version: "0.10.5"
  };
};
