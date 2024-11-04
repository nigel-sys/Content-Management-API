const AWS = require('aws-sdk');
const { handler } = require('../deletePost');

// Mock the DynamoDB DocumentClient
const dynamoDb = new AWS.DynamoDB.DocumentClient();
jest.mock('aws-sdk', () => {
  const mockDocumentClient = {
    delete: jest.fn(),
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mockDocumentClient),
    },
  };
});

describe('deletePost Lambda function', () => {
  const mockPostId = '12345';
  const mockEvent = {
    pathParameters: {
      id: mockPostId,
    },
  };

  it('should delete a post successfully and return a success message', async () => {
    // Mock successful DynamoDB delete call
    dynamoDb.delete.mockReturnValue({
      promise: () => Promise.resolve(),
    });

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ message: 'Post deleted successfully' });
  });

  it('should return a 500 error when DynamoDB delete fails', async () => {
    // Mock a DynamoDB error
    dynamoDb.delete.mockReturnValue({
      promise: () => Promise.reject(new Error('DynamoDB error')),
    });

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Could not delete post' });
  });
});