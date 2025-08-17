#!/usr/bin/env node

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface CheckResult {
  name: string;
  status: "success" | "warning" | "error";
  message: string;
  fix?: string;
}

function checkAWSCredentials(): CheckResult {
  try {
    const result = execSync("aws sts get-caller-identity", {
      encoding: "utf8",
    });
    const identity = JSON.parse(result);
    return {
      name: "AWS Credentials",
      status: "success",
      message: `✅ Authenticated as: ${identity.Arn}`,
    };
  } catch (error) {
    return {
      name: "AWS Credentials",
      status: "error",
      message: "❌ AWS credentials not configured",
      fix: "Run: aws configure",
    };
  }
}

function checkCDKBootstrap(): CheckResult {
  try {
    const region = process.env.CDK_DEFAULT_REGION || "us-east-1";
    execSync(
      `aws cloudformation describe-stacks --stack-name CDKToolkit --region ${region}`,
      {
        encoding: "utf8",
        stdio: "pipe",
      },
    );
    return {
      name: "CDK Bootstrap",
      status: "success",
      message: `✅ CDK bootstrapped in ${region}`,
    };
  } catch (error) {
    return {
      name: "CDK Bootstrap",
      status: "error",
      message: "❌ CDK not bootstrapped",
      fix: "Run: npx cdk bootstrap",
    };
  }
}

function checkGitHubRepo(): CheckResult {
  const repo =
    process.env.GITHUB_REPOSITORY || "zsantiago8712/coding_challenge";
  const branch = process.env.BRANCH_NAME || "main";

  try {
    // Check if we're in a git repo
    execSync("git rev-parse --git-dir", { stdio: "pipe" });

    // Check current branch
    const currentBranch = execSync("git branch --show-current", {
      encoding: "utf8",
    }).trim();

    if (currentBranch === branch) {
      return {
        name: "GitHub Repository",
        status: "success",
        message: `✅ Repository: ${repo}, Branch: ${branch}`,
      };
    } else {
      return {
        name: "GitHub Repository",
        status: "warning",
        message: `⚠️  Current branch (${currentBranch}) differs from deployment branch (${branch})`,
        fix: `Switch to ${branch}: git checkout ${branch}`,
      };
    }
  } catch (error) {
    return {
      name: "GitHub Repository",
      status: "warning",
      message: `⚠️  Repository: ${repo} (not verified)`,
      fix: "Ensure you have access to the repository",
    };
  }
}

function checkEnvironmentVariables(): CheckResult {
  const requiredVars = ["CDK_DEFAULT_REGION"];
  const optionalVars = [
    "GITHUB_REPOSITORY",
    "BRANCH_NAME",
    "DYNAMODB_TABLE_NAME",
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    return {
      name: "Environment Variables",
      status: "warning",
      message: `⚠️  Optional: ${missing.join(", ")} (will use defaults)`,
      fix: "Set variables or use defaults",
    };
  }

  const configured = [...requiredVars, ...optionalVars]
    .filter((varName) => process.env[varName])
    .map((varName) => `${varName}=${process.env[varName]}`);

  return {
    name: "Environment Variables",
    status: "success",
    message: `✅ Configured: ${
      configured.length > 0 ? configured.join(", ") : "Using defaults"
    }`,
  };
}

function checkDependencies(): CheckResult {
  const packageJsonPath = path.join(__dirname, "..", "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return {
      name: "Dependencies",
      status: "error",
      message: "❌ package.json not found",
      fix: "Run: bun install",
    };
  }

  const nodeModulesPath = path.join(__dirname, "..", "node_modules");

  if (!fs.existsSync(nodeModulesPath)) {
    return {
      name: "Dependencies",
      status: "error",
      message: "❌ node_modules not found",
      fix: "Run: bun install",
    };
  }

  return {
    name: "Dependencies",
    status: "success",
    message: "✅ Dependencies installed",
  };
}

function displayResults(results: CheckResult[]): void {
  console.log("\n🔍 Deployment Readiness Check\n");
  console.log("=".repeat(50));

  results.forEach((result) => {
    console.log(`\n${result.name}:`);
    console.log(`  ${result.message}`);
    if (result.fix) {
      console.log(`  💡 Fix: ${result.fix}`);
    }
  });

  const errors = results.filter((r) => r.status === "error");
  const warnings = results.filter((r) => r.status === "warning");

  console.log("\n" + "=".repeat(50));

  if (errors.length > 0) {
    console.log(
      `\n❌ ${errors.length} error(s) found. Please fix before deploying.`,
    );
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log(
      `\n⚠️  ${warnings.length} warning(s) found. Deployment should work but review recommendations.`,
    );
    console.log("\n🚀 Ready to deploy! Run: bun run deploy:full");
  } else {
    console.log("\n✅ All checks passed! Ready to deploy!");
    console.log("\n🚀 Run: bun run deploy:full");
  }
}

function main(): void {
  const checks = [
    checkDependencies(),
    checkAWSCredentials(),
    checkCDKBootstrap(),
    checkGitHubRepo(),
    checkEnvironmentVariables(),
  ];

  displayResults(checks);
}

if (require.main === module) {
  main();
}
