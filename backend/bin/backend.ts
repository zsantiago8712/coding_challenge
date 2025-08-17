#!/opt/homebrew/opt/node/bin/node
import * as cdk from "aws-cdk-lib";
import { NotesBackendStack } from "../lib/backend-stack";

const app = new cdk.App();

new NotesBackendStack(app, "BackendStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
