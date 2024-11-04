process.env.POSTS_TABLE = 'TestTable';
const AWS = require('aws-sdk-mock');
const { handler } = require('../updatePost'); 



describe("updatePost Lambda Function", () => {
  beforeAll(() => {
    // Mock DynamoDB update method
    AWS.mock("DynamoDB.DocumentClient", "update", (params, callback) => {
      if (params.Key.id === "existing-post-id") {
        // Simulating a successful update
        callback(null, {
          Attributes: {
            id: "existing-post-id",
            title: "Updated Title",
            content: "Updated Content",
            authorId: "123",
          },
        });
      } else {
        // Simulating a post not found scenario
        callback(null, {});
      }
    });
  });

  afterAll(() => {
    // Restoring all mocked AWS services
    AWS.restore("DynamoDB.DocumentClient");
  });

  it("should update the post when it exists", async () => {
    const event = {
      pathParameters: {
        id: "existing-post-id",
      },
      body: JSON.stringify({
        title: "Updated Title",
        content: "Updated Content",
        authorId: "123",
      }),
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      id: "existing-post-id",
      title: "Updated Title",
      content: "Updated Content",
      authorId: "123",
    });
  });

  it("should return 500 when the post does not exist", async () => {
    const event = {
      pathParameters: {
        id: "non-existing-post-id",
      },
      body: JSON.stringify({
        title: "Some Title",
        content: "Some Content",
        authorId: "123",
      }),
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ error: 'Could not update post' });
  });

  it("should return 500 on error", async () => {
    // Mock an error scenario
    AWS.mock("DynamoDB.DocumentClient", "update", (params, callback) => {
      callback(new Error("Some error occurred"));
    });

    const event = {
      pathParameters: {
        id: "any-id",
      },
      body: JSON.stringify({
        title: "Some Title",
        content: "Some Content",
        authorId: "123",
      }),
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ error: 'Could not update post' });
  });
});
