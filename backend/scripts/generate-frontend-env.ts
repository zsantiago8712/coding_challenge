#!/usr/bin/env node

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface StackOutputs {
  GraphQLAPIURL?: string;
  GraphQLEndpoint?: string;
  IdentityPoolId?: string;
  AmplifyDefaultDomain?: string;
}

function getStackOutputs(stackName: string): StackOutputs {
  try {
    const result = execSync(
      `aws cloudformation describe-stacks --stack-name ${stackName} --query "Stacks[0].Outputs" --output json`,
      {
        encoding: "utf8",
      }
    );

    const outputs = JSON.parse(result);
    const outputMap: StackOutputs = {};

    outputs.forEach((output: any) => {
      outputMap[output.OutputKey as keyof StackOutputs] = output.OutputValue;
    });

    return outputMap;
  } catch (error) {
    console.error(`❌ Error getting outputs from stack ${stackName}:`, error);
    return {};
  }
}

function generateFrontendEnv(): void {
  console.log("🔧 Generating frontend environment variables...\n");

  // Get outputs from backend stack
  const backendOutputs = getStackOutputs("BackendStack");
  const hostingOutputs = getStackOutputs("HostingStack");

  if (!backendOutputs.GraphQLAPIURL || !backendOutputs.IdentityPoolId) {
    console.error(
      "❌ Backend stack outputs not found. Make sure the backend is deployed first."
    );
    console.log("💡 Run: bun run deploy:backend");
    process.exit(1);
  }

  const region =
    process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || "us-east-1";

  const envContent = `# 🌐 Frontend Environment Variables
# Generated automatically from AWS CloudFormation outputs
# Last updated: ${new Date().toISOString()}

# ========================================
# 🚀 AWS CONFIGURATION
# ========================================

# GraphQL API Endpoint
NEXT_PUBLIC_GRAPHQL_ENDPOINT=${backendOutputs.GraphQLAPIURL}

# AWS Region
NEXT_PUBLIC_AWS_REGION=${region}

# Cognito Identity Pool ID
NEXT_PUBLIC_IDENTITY_POOL_ID=${backendOutputs.IdentityPoolId}

# ========================================
# 🌍 DEPLOYMENT INFO
# ========================================

# Amplify Domain (if hosting is deployed)
${
  hostingOutputs.AmplifyDefaultDomain
    ? `# AMPLIFY_DOMAIN=${hostingOutputs.AmplifyDefaultDomain}`
    : "# AMPLIFY_DOMAIN=Not deployed yet"
}

# ========================================
# 🔧 DEVELOPMENT SETTINGS
# ========================================

# Enable debug mode for development
# NEXT_PUBLIC_DEBUG=true

# API timeout (milliseconds)
# NEXT_PUBLIC_API_TIMEOUT=10000
`;

  // Write to frontend .env.local
  const frontendEnvPath = path.join(__dirname, "../../website/.env.local");

  try {
    fs.writeFileSync(frontendEnvPath, envContent);
    console.log("✅ Frontend environment file created successfully!");
    console.log(`📁 Location: ${frontendEnvPath}`);
    console.log("\n📋 Generated variables:");
    console.log(`   🔗 GraphQL Endpoint: ${backendOutputs.GraphQLAPIURL}`);
    console.log(`   🌍 AWS Region: ${region}`);
    console.log(`   🔐 Identity Pool: ${backendOutputs.IdentityPoolId}`);

    if (hostingOutputs.AmplifyDefaultDomain) {
      console.log(
        `   🌐 Amplify Domain: ${hostingOutputs.AmplifyDefaultDomain}`
      );
    }

    console.log("\n🚀 Your frontend is now configured for local development!");
    console.log("💡 You can now run: cd website && bun run dev");
  } catch (error) {
    console.error("❌ Error writing frontend environment file:", error);
    process.exit(1);
  }
}

function main(): void {
  generateFrontendEnv();
}

if (require.main === module) {
  main();
}

export { generateFrontendEnv };
