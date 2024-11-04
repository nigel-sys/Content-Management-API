const AWS = require('aws-sdk-mock');
const { handler } = require('../deletePost'); 

describe("deletePost Lambda Function", () => {
  beforeAll(() => {
    // Mock DynamoDB delete method
    AWS.mock("DynamoDB.DocumentClient", "delete", (params, callback) => {
      if (params.Key.id === "existing-post-id") {
        // Simulating a successful delete
        callback(null, {});
      } else {
        // Simulating a delete failure (if needed)
        callback(new Error("Post not found"));
      }
    });
  });

  afterAll(() => {
    // Restoring all mocked AWS services
    AWS.restore("DynamoDB.DocumentClient");
  });

  it("should delete the post when it exists", async () => {
    const event = {
      pathParameters: {
        id: "existing-post-id",
      },
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ message: 'Post deleted successfully' });
  });

  it("should return 500 when the post does not exist", async () => {
    const event = {
      pathParameters: {
        id: "non-existing-post-id",
      },
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ error: 'Could not delete post' });
  });

  it("should return 500 on error", async () => {
    // Mock an error scenario
    AWS.mock("DynamoDB.DocumentClient", "delete", (params, callback) => {
      callback(new Error("Some error occurred"));
    });

    const event = {
      pathParameters: {
        id: "any-id",
      },
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ error: 'Could not delete post' });
  });
});
