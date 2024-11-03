const AWS = require('aws-sdk');

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
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Post deleted successfully' }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not delete post' }),
    };
  }
};