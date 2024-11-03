const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.POSTS_TABLE;

exports.handler = async (event) => {
  const { title, content, authorId } = JSON.parse(event.body);

  const params = {
    TableName: tableName,
    Item: {
      id: uuid.v4(),
      title,
      content,
      authorId,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Post created successfully' }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create post' }),
    };
  }
};