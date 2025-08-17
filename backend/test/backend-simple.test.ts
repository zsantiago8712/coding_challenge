import { describe, test, expect, beforeAll } from "bun:test";
import { NotesBackendStack } from "../lib/backend-stack";
import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

describe("Backend Stack Tests", () => {
  let stack: NotesBackendStack;
  let template: Template;

  beforeAll(() => {
    const app = new App();
    stack = new NotesBackendStack(app, "TestStack");
    template = Template.fromStack(stack);
  });

  test("DynamoDB Table is created", () => {
    template.hasResourceProperties("AWS::DynamoDB::Table", {
      TableName: "Notes",
      BillingMode: "PAY_PER_REQUEST",
    });
  });

  test("AppSync GraphQL API is created", () => {
    template.hasResourceProperties("AWS::AppSync::GraphQLApi", {
      Name: "notes-sentiment-api",
      AuthenticationType: "AWS_IAM",
    });
  });

  test("Cognito Identity Pool is created", () => {
    template.hasResourceProperties("AWS::Cognito::IdentityPool", {
      AllowUnauthenticatedIdentities: true,
    });
  });

  test("Stack has required outputs", () => {
    const templateObj = template.toJSON();
    const outputs = templateObj.Outputs;

    expect(outputs).toBeDefined();
    expect(outputs.GraphQLAPIURL).toBeDefined();
    expect(outputs.IdentityPoolId).toBeDefined();
  });

  test("GraphQL resolvers are created", () => {
    // Just check that we have some resolvers
    template.hasResource("AWS::AppSync::Resolver", {});
  });
});
