
module.exports = function imageARCAdapter(content) {

  const img = {
    _id: content._id,
    created_date: content.created_date,
    height: content.height,
    width: content.width,
    last_updated_date: content.last_updated_date,
    type: "image",
    url: content.url,
    version: "0.10.5",
  }
  return img
}
