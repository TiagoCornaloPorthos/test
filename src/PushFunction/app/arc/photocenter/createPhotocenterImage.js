const config = require('../config');

module.exports = function createPhotocenterImage(fetch, FormData) {

  return async function(image) {
    var form = new FormData();

    form.append('ans', JSON.stringify(image), {contentType: 'application/json'});
    const formHeaders = form.getHeaders();

    let res = await fetch(`${config.hostUrl}/photo/api/v2/photos/`, {
      method: 'POST',
      body: form,
      headers: {
        ...formHeaders,
        Authorization: `Bearer ${config.auth.accessToken}`,
      }
    });
    return await res.json();
  }
}
