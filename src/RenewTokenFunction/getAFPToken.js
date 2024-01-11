const { fetchJSON: fetch } = require('/opt/nodejs/fetch');
const {getTokenFromDB, saveTokenToDB} = require('/opt/nodejs/tokenDB')

const AFPConfig = {
  hostUrl: process.env.AFP_API_HOST_URL,
  auth: {
    accountUsername: process.env.AFP_API_USERNAME,
    accountPassword: process.env.AFP_API_PASSWORD,
    clientId: process.env.AFP_API_CLIENT_ID,
    clientSecret: process.env.AFP_API_CLIENT_SECRET
  }
}

const AFPHeaders = {
  accept: 'application/json',
  'x-apiversion': '1.0',
  'Authorization': 'Basic ' + Buffer.from(AFPConfig.auth.clientId + ":" + AFPConfig.auth.clientSecret).toString('base64')
}

const getRefreshTokenFromDB = async () => {
  const refreshToken = await getTokenFromDB('AFP_REFRESH_TOKEN')
  return refreshToken
}

const generateRefreshToken = async () => {

  const res = await fetch(`${AFPConfig.hostUrl}/oauth/token?username=${AFPConfig.auth.accountUsername}&password=${AFPConfig.auth.accountPassword}&grant_type=password`, {
    headers: AFPHeaders
  })
  return res.refresh_token
}

const generateToken = async refreshToken => {

  const res = await fetch(`${AFPConfig.hostUrl}/oauth/token?refresh_token=${refreshToken}&grant_type=refresh_token`, {
    headers: AFPHeaders
  })
  return res.access_token
}

const getAFPToken = async () => {
  const refreshToken = await getRefreshTokenFromDB()
  let token = ''

  try {
    token = await generateToken(refreshToken)
  }

  catch (err) {
    const newRefreshToken = await generateRefreshToken()
    await saveTokenToDB('AFP_REFRESH_TOKEN', newRefreshToken)
    token = await generateToken(newRefreshToken)
  }

  await saveTokenToDB('AFP_TOKEN', token)

}

module.exports = getAFPToken;
