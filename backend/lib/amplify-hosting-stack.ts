import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as amplify from "aws-cdk-lib/aws-amplify";
import * as ssm from "aws-cdk-lib/aws-ssm";

interface AmplifyHostingStackProps extends cdk.StackProps {
  repository: string; // 'owner/repo' o 'https://github.com/owner/repo'
  branchName: string; // 'main'
  appRoot?: string; // 'website' por defecto
  gitHubToken?: string; // Token de GitHub para conectar automáticamente el repo
  // Opcional: token de GitHub guardado en SSM para conectar el repo automáticamente
  githubTokenParamName?: string; // p.ej. '/amplify/github/token'

  // Vars de entorno para el frontend
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

    // Debug logging
    console.log("AmplifyHostingStack props:", {
      repository,
      branchName,
      appRoot,
      graphQlEndpoint,
      identityPoolId,
      region,
    });

    const buildSpec = {
      version: "1.0",
      applications: [
        {
          appRoot, // subcarpeta del monorepo
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

    // GitHub token from environment variable or SSM parameter
    const oauthToken =
      gitHubToken ||
      (githubTokenParamName
        ? ssm.StringParameter.fromSecureStringParameterAttributes(
            this,
            "GitHubToken",
            { parameterName: githubTokenParamName },
          ).stringValue
        : undefined);

    const app = new amplify.CfnApp(this, "AmplifyApp", {
      name: "notes-sentiment-website",
      // repository, // Comentamos esto para conectar manualmente
      platform: "WEB",
      buildSpec: JSON.stringify(buildSpec),
      // oauthToken, // No necesario sin repositorio automático
      environmentVariables: [
        { name: "AMPLIFY_MONOREPO_APP_ROOT", value: appRoot },
        { name: "BUN_INSTALL_CACHE_DIR", value: "/tmp/.bun-cache" },
      ].filter(
        (env) =>
          env.value !== undefined && env.value !== null && env.value !== "",
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
      (env) =>
        env.value !== undefined && env.value !== null && env.value !== "",
    );

    // El branch se creará manualmente desde la consola una vez que conectes el repositorio
    // const branch = new amplify.CfnBranch(this, "AmplifyBranch", {
    //   appId: app.attrAppId,
    //   branchName,
    //   stage: "PRODUCTION",
    //   enableAutoBuild: true,
    //   framework: "Next.js - SSR",
    //   environmentVariables: branchEnv,
    // });

    // Outputs importantes para el deployment
    new cdk.CfnOutput(this, "AmplifyAppId", {
      value: app.attrAppId,
      description: "Amplify App ID for manual configuration",
    });

    new cdk.CfnOutput(this, "AmplifyBranchName", {
      value: branchName,
      description: "Branch name to deploy manually",
    });

    new cdk.CfnOutput(this, "AmplifyDefaultDomain", {
      value: `Conectar repositorio primero en: https://console.aws.amazon.com/amplify/home?region=${region}#/${app.attrAppId}`,
      description: "Instructions for connecting repository",
    });

    new cdk.CfnOutput(this, "AmplifyAppConsoleUrl", {
      value: `https://console.aws.amazon.com/amplify/home?region=${region}#/${app.attrAppId}`,
      description: "Amplify Console URL for manual configuration",
    });

    new cdk.CfnOutput(this, "ManualSetupInstructions", {
      value: `1. Abrir: https://console.aws.amazon.com/amplify/home?region=${region}#/${app.attrAppId} 2. Conectar repositorio: ${repository} 3. Seleccionar rama: ${branchName} 4. Configurar build: ${appRoot}`,
      description: "Step-by-step instructions for connecting the repository",
    });
  }
}
