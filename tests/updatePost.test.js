const AWS = require('aws-sdk');
const { handler } = require('../updatePost');

// Mock the DynamoDB DocumentClient
const dynamoDb = new AWS.DynamoDB.DocumentClient();
jest.mock('aws-sdk', () => {
  const mockDocumentClient = {
    update: jest.fn(),
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mockDocumentClient),
    },
  };
});

describe('updatePost Lambda function', () => {
  const tableName = process.env.POSTS_TABLE;
  const mockPostId = '12345';
  const mockEvent = {
    pathParameters: {
      id: mockPostId,
    },
    body: JSON.stringify({
      title: 'Updated Title',
      content: 'Updated content of the post',
      authorId: '67890',
    }),
  };

  it('should update a post successfully and return the updated post', async () => {
    // Mock the response from DynamoDB update call
    dynamoDb.update.mockReturnValue({
      promise: () => Promise.resolve({
        Attributes: {
          id: mockPostId,
          title: 'Updated Title',
          content: 'Updated content of the post',
          authorId: '67890',
        },
      }),
    });

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      id: mockPostId,
      title: 'Updated Title',
      content: 'Updated content of the post',
      authorId: '67890',
    });
  });

  it('should return a 500 error when DynamoDB update fails', async () => {
    // Mock a DynamoDB error
    dynamoDb.update.mockReturnValue({
      promise: () => Promise.reject(new Error('DynamoDB error')),
    });

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Could not update post' });
  });
});
