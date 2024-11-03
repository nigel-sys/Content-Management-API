const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.POSTS_TABLE;

exports.handler = async (event) => {
  const { id } = event.pathParameters;
  const { title, content, authorId } = JSON.parse(event.body);

  const params = {
    TableName: tableName,
    Key: {
      id,
    },
    UpdateExpression: 'set title = :title, content = :content, authorId = :authorId',
    ExpressionAttributeValues: {
      ':title': title,
      ':content': content,
      ':authorId': authorId,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not update post' }),
    };
  }
};