const AWS = require('aws-sdk');
require('dotenv').config();

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.POSTS_TABLE;

exports.handler = async (event) => {
  const { id } = event.pathParameters;

  const params = {
    TableName: tableName,
    Key: {
      id,
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();
    if (result.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Post not found' }),
      };
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not get post' }),
    };
  }
};