const AWS = require('aws-sdk-mock');
const { handler } = require('../createPost');
process.env.POSTS_TABLE = 'TestTable';

describe("createPost Lambda Function", () => {
  beforeAll(() => {
    AWS.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      callback(null, { success: true });
    });
  });

  afterAll(() => {
    AWS.restore("DynamoDB.DocumentClient");
  });

  it("should successfully create a post", async () => {
    const event = {
      body: JSON.stringify({
        title: "Test Title",
        content: "Test Content",
        authorId: "123"
      })
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body).message).toBe("Post created successfully");
  });
});
