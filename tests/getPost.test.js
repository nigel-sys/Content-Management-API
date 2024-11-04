const AWS = require('aws-sdk-mock');
const { handler } = require('../getPost'); 

describe("getPost Lambda Function", () => {
  beforeAll(() => {
    // Mock DynamoDB get method
    AWS.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
      if (params.Key.id === "existing-post-id") {
        // Simulating an existing post
        callback(null, {
          Item: {
            id: "existing-post-id",
            title: "Test Title",
            content: "Test Content",
            authorId: "123",
          },
        });
      } else {
        // Simulating a post not found
        callback(null, {});
      }
    });
  });

  afterAll(() => {
    // Restoring all mocked AWS services
    AWS.restore("DynamoDB.DocumentClient");
  });

  it("should return the post when it exists", async () => {
    const event = {
      pathParameters: {
        id: "existing-post-id",
      },
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      id: "existing-post-id",
      title: "Test Title",
      content: "Test Content",
      authorId: "123",
    });
  });

  it("should return 404 when the post does not exist", async () => {
    const event = {
      pathParameters: {
        id: "non-existing-post-id",
      },
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toEqual({ error: 'Post not found' });
  });

  it("should return 500 on error", async () => {
    // Mock an error scenario
    AWS.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
      callback(new Error("Some error occurred"));
    });

    const event = {
      pathParameters: {
        id: "any-id",
      },
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ error: 'Could not get post' });
  });
});
