const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient()
const tokensTable = process.env.AWS_TOKENS_TABLE_NAME;

const getTokenFromDB = async key => {
  const params = {
    TableName: tokensTable,
    Key: {
        "TokenId": key,
      }
    };
  const item = await docClient.get(params).promise()

  return item.Item !== undefined ? item.Item.content : ''
}

const saveTokenToDB = (target, token) => {
  const params = {
    TableName: tokensTable,
    Key:{
        "TokenId": target,
    },
    UpdateExpression: "SET content = :v",
    ExpressionAttributeValues:{
        ":v":token
    },
    ReturnValues:"UPDATED_NEW"
  };

  return docClient.update(params)
  .promise()
  .then(res => console.log('Nuevo token ' + res.Attributes.content + ' asignado a ' + target));

}

module.exports = {
  getTokenFromDB,
  saveTokenToDB
}
