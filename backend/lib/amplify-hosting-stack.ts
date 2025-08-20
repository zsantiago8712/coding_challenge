import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as amplify from "aws-cdk-lib/aws-amplify";
import * as ssm from "aws-cdk-lib/aws-ssm";

interface AmplifyHostingStackProps extends cdk.StackProps {
  repository: string;
  branchName: string;
  appRoot?: string;
  gitHubToken?: string;

  githubTokenParamName?: string;

  graphQlEndpoint: string;
  identityPoolId: string;
  region: string;
}

export class AmplifyHostingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AmplifyHostingStackProps) {
    super(scope, id, props);

    const {
      repository,
      branchName,
      appRoot = "website",
      githubTokenParamName,
      graphQlEndpoint,
      identityPoolId,
      region,
      gitHubToken,
    } = props;

    const buildSpec = {
      version: "1.0",
      applications: [
        {
          appRoot,
          frontend: {
            phases: {
              preBuild: {
                commands: [
                  "echo 'Installing dependencies...'",
                  "bun ci",
                  "echo 'Dependencies installed successfully'",
                ],
              },
              build: {
                commands: [
                  "echo 'Starting build process...'",
                  "bun run build",
                  "echo 'Build completed successfully'",
                ],
              },
            },
            artifacts: {
              baseDirectory: ".next",
              files: ["**/*"],
            },
            cache: {
              paths: ["node_modules/**/*", ".next/cache/**/*"],
            },
          },
        },
      ],
    };

    const app = new amplify.CfnApp(this, "AmplifyApp", {
      name: "notes-sentiment-website",
      platform: "WEB",
      buildSpec: JSON.stringify(buildSpec),

      environmentVariables: [
        { name: "AMPLIFY_MONOREPO_APP_ROOT", value: appRoot },
        { name: "BUN_INSTALL_CACHE_DIR", value: "/tmp/.bun-cache" },
      ].filter(
        (env) =>
          env.value !== undefined && env.value !== null && env.value !== ""
      ),
      customRules: [{ source: "/<*>", target: "/index.html", status: "200" }],
      autoBranchCreationConfig: {
        enableAutoBuild: true,
      },
    });

    const branchEnv: amplify.CfnBranch.EnvironmentVariableProperty[] = [
      { name: "NEXT_PUBLIC_GRAPHQL_ENDPOINT", value: graphQlEndpoint },
      { name: "NEXT_PUBLIC_AWS_REGION", value: region },
      { name: "NEXT_PUBLIC_IDENTITY_POOL_ID", value: identityPoolId },
      { name: "BUN_CONFIG_FUND", value: "false" },
      { name: "BUN_CONFIG_AUDIT", value: "false" },
      { name: "BUN_INSTALL_CACHE_DIR", value: "/tmp/.bun-cache" },
    ].filter(
      (env) => env.value !== undefined && env.value !== null && env.value !== ""
    );

    new cdk.CfnOutput(this, "AmplifyAppId", {
      value: app.attrAppId,
      description: "Amplify App ID for manual configuration",
    });

    new cdk.CfnOutput(this, "AmplifyBranchName", {
      value: branchName,
      description: "Branch name to deploy manually",
    });

    new cdk.CfnOutput(this, "AmplifyDefaultDomain", {
      value: `https://console.aws.amazon.com/amplify/home?region=${region}#/${app.attrAppId}`,
      description: "Instructions for connecting repository",
    });

    new cdk.CfnOutput(this, "AmplifyAppConsoleUrl", {
      value: `https://console.aws.amazon.com/amplify/home?region=${region}#/${app.attrAppId}`,
      description: "Amplify Console URL for manual configuration",
    });

    new cdk.CfnOutput(this, "ManualSetupInstructions", {
      value: `https://console.aws.amazon.com/amplify/home?region=${region}#/${app.attrAppId}`,
      description: "Step-by-step instructions for connecting the repository",
    });
  }
}
