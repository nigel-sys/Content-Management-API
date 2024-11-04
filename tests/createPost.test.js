process.env.POSTS_TABLE = 'TestTable';
process.env.AWS_REGION = 'us-east-1'; 

const AWS = require('aws-sdk-mock');
const { handler } = require('../createPost');


describe("createPost Lambda Function", () => {
  beforeAll(() => {
    AWS.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      callback(null, { success: true });
    });
    
    // Mock AWS config for credentials
    AWS.config.update({
      credentials: {
        accessKeyId: 'fakeAccessKeyId',
        secretAccessKey: 'fakeSecretAccessKey',
      },
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
