#!/usr/bin/env ts-node

/**
 * CI/CD Deployment Script
 * Handles automated deployment with proper error handling and logging
 */

import { execSync } from "child_process";
import { exit } from "process";

interface DeploymentConfig {
  skipTests?: boolean;
  skipSeed?: boolean;
  environment: "development" | "staging" | "production";
}

class CICDDeployer {
  private config: DeploymentConfig;

  constructor(config: DeploymentConfig) {
    this.config = config;
  }

  private log(
    message: string,
    level: "info" | "success" | "error" | "warn" = "info",
  ) {
    const timestamp = new Date().toISOString();
    const emoji = {
      info: "📋",
      success: "✅",
      error: "❌",
      warn: "⚠️",
    };

    console.log(`${emoji[level]} [${timestamp}] ${message}`);
  }

  private execCommand(command: string, description: string): void {
    try {
      this.log(`Running: ${description}`);
      execSync(command, { stdio: "inherit" });
      this.log(`Completed: ${description}`, "success");
    } catch (error) {
      this.log(`Failed: ${description}`, "error");
      console.error(error);
      exit(1);
    }
  }

  private async captureOutputs(): Promise<{
    graphqlEndpoint: string;
    identityPoolId: string;
  }> {
    try {
      this.log("Capturing CloudFormation outputs...");

      const graphqlEndpoint = execSync(
        `aws cloudformation describe-stacks --stack-name BackendStack --query 'Stacks[0].Outputs[?OutputKey==\`GraphQLEndpoint\`].OutputValue' --output text --region us-east-1`,
        { encoding: "utf8" },
      ).trim();

      const identityPoolId = execSync(
        `aws cloudformation describe-stacks --stack-name BackendStack --query 'Stacks[0].Outputs[?OutputKey==\`IdentityPoolId\`].OutputValue' --output text --region us-east-1`,
        { encoding: "utf8" },
      ).trim();

      this.log(`GraphQL Endpoint: ${graphqlEndpoint}`);
      this.log(`Identity Pool ID: ${identityPoolId}`);

      return { graphqlEndpoint, identityPoolId };
    } catch (error) {
      this.log("Failed to capture outputs", "error");
      throw error;
    }
  }

  async deploy(): Promise<void> {
    this.log(`🚀 Starting CI/CD deployment for ${this.config.environment}`);

    // Step 1: Pre-deployment checks
    if (!this.config.skipTests) {
      this.execCommand("npm test", "Running backend tests");
    }

    this.execCommand("bun run check", "Pre-deployment validation");

    // Step 2: Deploy infrastructure
    this.execCommand("bun run deploy:full", "Deploying backend infrastructure");

    // Step 3: Capture outputs for GitHub Actions
    const outputs = await this.captureOutputs();

    // Export outputs for GitHub Actions
    if (process.env.GITHUB_ACTIONS) {
      console.log(
        `::set-output name=graphql-endpoint::${outputs.graphqlEndpoint}`,
      );
      console.log(
        `::set-output name=identity-pool-id::${outputs.identityPoolId}`,
      );
    }

    // Step 4: Seed database
    if (!this.config.skipSeed) {
      const seedCommand =
        this.config.environment === "production"
          ? "bun run seed:small"
          : "bun run seed:small";

      this.execCommand(seedCommand, "Seeding database");
    }

    // Step 5: Generate frontend environment
    this.execCommand(
      "bun run setup-frontend",
      "Generating frontend environment",
    );

    this.log("🎉 Deployment completed successfully!", "success");
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const environment =
  (args
    .find((arg) => arg.includes("--env="))
    ?.split("=")[1] as DeploymentConfig["environment"]) || "development";
const skipTests = args.includes("--skip-tests");
const skipSeed = args.includes("--skip-seed");

const deployer = new CICDDeployer({
  environment,
  skipTests,
  skipSeed,
});

// Run deployment
deployer.deploy().catch((error) => {
  console.error("❌ Deployment failed:", error);
  exit(1);
});
