# Content Management API

This project is a RESTful API for managing posts, built using Node.js and AWS DynamoDB. It leverages the Serverless Framework for deployment and CI/CD via GitHub Actions.

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [API Endpoints](#api-endpoints)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
    * [Running Locally](#running-locally)
* [Deployment](#deployment)
    * [CI/CD Setup](#cicd-setup)
* [Testing](#testing)
* [License](#license)

## Overview

The Content Management API allows users to create, read, update, and delete posts. It is designed for scalability and easy integration with front-end applications.

## Features

- CRUD operations for posts (Create, Read, Update, Delete).
- Data storage in AWS DynamoDB.
- Secure access using IAM roles.
- Automated deployment with Serverless Framework and GitHub Actions.

## Technologies Used

- Node.js
- AWS DynamoDB
- Serverless Framework
- GitHub Actions
- JavaScript (Node.js 20.x)

## API Endpoints

| Method | Endpoint                 | Description                                 |
|--------|-------------------------|----------------------------------------------|
| POST   | /posts                   | Create a new post                             |
| GET    | /posts/{id}              | Retrieve a specific post                     |
| PUT    | /posts/{id}              | Update a specific post                     |
| DELETE | /posts/{id}              | Delete a specific post                     |

## Getting Started

### Prerequisites

- Node.js (version 20.x or later)
- AWS account with IAM permissions
- Serverless Framework installed globally
- GitHub account for CI/CD setup

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/Content-Management-API.git
cd Content-Management-API
```
2. Install dependencies:
```bash
npm install
```
3. Set up your AWS credentials (this is optional for local testing):
```bash
aws configure
```
### Running Locally

To run the API on your local machine, use the Serverless Offline plugin:
-On the 'serverless.yml' file add:
```bash
plugins:
  - serverless-offline
```
-In your project root run: 
```bash
npm serverless offline
```
Your API will be available at [http://localhost:3000](http://localhost:3000).

## Deployment

To deploy the API to AWS, follow these steps:

- Ensure you have the necessary AWS credentials configured in your environment.
- Add your AWS access key and secret key, as well as your Serverless Framework access credentials, to       GitHub Secrets. You can do this by navigating to your GitHub repository, clicking on **Settings**, then **Secrets and variables**, and finally **Actions**. 
- Create the following secrets:
  - `AWS_ACCESS_KEY_ID`: Your AWS access key ID
  - `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
  - `SERVERLESS_ACCESS_KEY`: Your Serverless Framework access key (if required)
- Use the Serverless Framework to deploy the API:

```bash
npm serverless deploy --stage dev
```

## CI/CD Setup

This project uses GitHub Actions for continuous integration and deployment. The CI/CD process is defined in the `.github/workflows/deploy.yml` file.

### Steps in the CI/CD Process

- **Code Checkout**: Get the latest code from the repository.
- **Cache Node Modules**: Save Node.js dependencies to speed up future builds.
- **Setup Node.js**: Set up Node.js version 20.
- **Install Dependencies**: Install the necessary npm packages.
- **Determine Deployment Stage**: Figure out the deployment stage based on the branch being pushed.
- **Deploy with Serverless**: Use the Serverless Framework to deploy the API to AWS.

## CI/CD Process Screenshots

Here are some screenshots demonstrating the CI/CD process:

### GitHub Actions Workflow

![GitHub Actions Workflow](screenshots/github-actions-workflow.png)

### Successful Deployment

![Successful Deployment](screenshots/successful-deployment.png)

### CI/CD Logs

![CI/CD Logs](screenshots/cicd-logs.png)


## Testing

To run tests on your local machine, make sure you have a testing framework set up like Jest or Mocha (the project has already set-up with jest testing framework). You can run tests using:
```bash
npx jest
```

## License

This project is licensed under the MIT License. 