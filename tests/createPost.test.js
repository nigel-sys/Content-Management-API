const AWS = require('aws-sdk');
const { handler } = require('../createPost');

// Mock DynamoDB
const dynamoDb = new AWS.DynamoDB.DocumentClient();
jest.mock('aws-sdk', () => {
  const mockDynamoDB = { put: jest.fn().mockReturnThis(), promise: jest.fn() };
  return {
    DynamoDB: { DocumentClient: jest.fn(() => mockDynamoDB) },
  };
});

describe('createPost Lambda function', () => {
  it('should create a new post successfully', async () => {
    // Mock input event
    const event = {
      body: JSON.stringify({
        title: 'Test Post',
        content: 'This is a test post content',
        authorId: '12345',
      }),
    };

    // Mock DynamoDB put response
    dynamoDb.put().promise.mockResolvedValue({});

    const result = await handler(event);
    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toEqual({ message: 'Post created successfully' });
  });

  it('should return an error when DynamoDB fails', async () => {
    // Mock failure
    dynamoDb.put().promise.mockRejectedValue(new Error('DynamoDB error'));

    const event = {
      body: JSON.stringify({
        title: 'Test Post',
        content: 'This is a test post content',
        authorId: '12345',
      }),
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Could not create post' });
  });
});
