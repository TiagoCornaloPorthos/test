const { fetchJSON: fetch } = require('/opt/nodejs/fetch');
const {saveTokenToDB} = require('/opt/nodejs/tokenDB')

const EFEconfig = {
  hostUrl: process.env.EFESERVICIOS_API_HOST_URL,
  auth: {
    clientId: process.env.EFESERVICIOS_API_CLIENT_ID,
    clientSecret: process.env.EFESERVICIOS_API_CLIENT_SECRET
  }
}

const getToken = async () => {

  const token = await fetch(`${EFEconfig.hostUrl}/account/token?clientId=${EFEconfig.auth.clientId}&clientSecret=${EFEconfig.auth.clientSecret}`, {
    headers: {
      accept: 'application/json',
      'x-apiversion': '1.0'
    }
  })
  return token
}

const getEFEToken = async () => {

  await saveTokenToDB('EFE', await getToken())

}

module.exports = getEFEToken
