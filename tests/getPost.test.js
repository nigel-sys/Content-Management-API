// tests/getPost.test.js
const AWS = require('aws-sdk');
const { handler } = require('../getPost');

// Mock the DynamoDB DocumentClient
const dynamoDb = new AWS.DynamoDB.DocumentClient();
jest.mock('aws-sdk', () => {
  const mockDocumentClient = {
    get: jest.fn(),
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mockDocumentClient),
    },
  };
});

describe('getPost Lambda function', () => {
  const tableName = process.env.POSTS_TABLE;
  const mockPostId = '12345';
  const mockEvent = {
    pathParameters: {
      id: mockPostId,
    },
  };

  it('should return a post successfully when found', async () => {
    // Mock the response from DynamoDB get call
    dynamoDb.get.mockReturnValue({
      promise: () => Promise.resolve({ Item: { id: mockPostId, title: 'Sample Post', content: 'This is a test post.' } }),
    });

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      id: mockPostId,
      title: 'Sample Post',
      content: 'This is a test post.',
    });
  });

  it('should return a 404 error when the post is not found', async () => {
    // Mock an empty response from DynamoDB
    dynamoDb.get.mockReturnValue({
      promise: () => Promise.resolve({}),
    });

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ error: 'Post not found' });
  });

  it('should return a 500 error when DynamoDB fails', async () => {
    // Mock a DynamoDB error
    dynamoDb.get.mockReturnValue({
      promise: () => Promise.reject(new Error('DynamoDB error')),
    });

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Could not get post' });
  });
});
