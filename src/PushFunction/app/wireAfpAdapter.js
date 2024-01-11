const { parse, format } = require("date-fns");
const placeholders = require("./mediaPlaceholders/AFP");


const WIRE_NAME = 'AFP';

module.exports = function wireAfpAdapter(content) {
  const env = process.env.Env;
  const placeholderObj = placeholders[env]
  let created_date = parse(content.created, "yyyy-MM-dd'T'HH:mm:ss'Z'", new Date());
  let last_updated_date = parse(content.published, "yyyy-MM-dd'T'HH:mm:ss'Z'", new Date());
  return {
    canonical_website: "tn",
    content_elements: content.news.map((text) => {
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
    display_date: format(created_date, "yyyy-MM-dd'T'HH:mm:ss'Z"),
    headlines: {
      basic: content.title
    },
    subheadlines: {
      basic: ''
    },
    promo_items:
      {
        basic: placeholderObj
      },
    description: {
      basic: ''
    },
    language: content.lang,
    last_updated_date: format(last_updated_date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z"),
    source: {
      source_id: 'afp-'+content.newsItemID,
      source_type: "wires",
      system: "artear i/o"
    },
    taxonomy: {
      tags: [
        {
          description: "AFP",
          slug: "afp",
          text: "AFP"
        }
      ]
    },
    type: "story",
    subtype: "article",
    version: "0.10.5"
  };
};
