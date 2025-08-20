import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import { Construct } from "constructs";
import * as path from "path";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";

export class NotesBackendStack extends cdk.Stack {
  public readonly graphqlApi: appsync.GraphqlApi;
  public readonly notesTable: dynamodb.Table;
  public readonly identityPool: cognito.CfnIdentityPool;

  public get graphQlEndpoint(): string {
    if (!this.graphqlApi) {
      throw new Error("GraphQL API not initialized");
    }
    return this.graphqlApi.graphqlUrl;
  }

  public get identityPoolId(): string {
    if (!this.identityPool) {
      throw new Error("Identity Pool not initialized");
    }
    return this.identityPool.ref;
  }

  // ...existing code...
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.notesTable = new dynamodb.Table(this, "NotesTable", {
      tableName: "Notes",
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    });

    this.notesTable.addGlobalSecondaryIndex({
      indexName: "SentimentIndex",
      partitionKey: {
        name: "sentiment",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "dateCreated",
        type: dynamodb.AttributeType.STRING,
      },
    });

    this.graphqlApi = new appsync.GraphqlApi(this, "NotesApi", {
      name: "notes-sentiment-api",
      schema: appsync.SchemaFile.fromAsset(
        path.join(__dirname, "../schema/schema.graphql")
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
      xrayEnabled: true,
    });

    this.identityPool = new cognito.CfnIdentityPool(this, "NotesIdentityPool", {
      allowUnauthenticatedIdentities: true,
      identityPoolName: "NotesIdentityPool",
    });

    const unauthRole = new iam.Role(this, "UnauthRole", {
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "unauthenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
      description: "Role for unauthenticated users to access AppSync",
    });

    unauthRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["appsync:GraphQL"],
        resources: [this.graphqlApi.arn + "/*"],
      })
    );

    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      "IdentityPoolRoleAttachment",
      {
        identityPoolId: this.identityPool.ref,
        roles: {
          unauthenticated: unauthRole.roleArn,
        },
      }
    );

    const notesDataSource = this.graphqlApi.addDynamoDbDataSource(
      "NotesDataSource",
      this.notesTable
    );

    this.createResolvers(notesDataSource);

    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: this.graphqlApi.graphqlUrl,
      description: "GraphQL API URL",
    });

    new cdk.CfnOutput(this, "GraphQLAPIId", {
      value: this.graphqlApi.apiId,
      description: "GraphQL API ID",
    });

    new cdk.CfnOutput(this, "IdentityPoolId", {
      value: this.identityPool.ref,
      description: "Cognito Identity Pool ID",
    });

    new cdk.CfnOutput(this, "DynamoDBTableName", {
      value: this.notesTable.tableName,
      description: "DynamoDB Table Name",
    });
  }

  private createResolvers(dataSource: appsync.DynamoDbDataSource) {
    dataSource.createResolver("CreateNoteMutation", {
      typeName: "Mutation",
      fieldName: "createNote",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, "../resolvers/createNote.req.vtl")
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, "../resolvers/createNote.res.vtl")
      ),
    });

    dataSource.createResolver("GetNotesQuery", {
      typeName: "Query",
      fieldName: "getNotes",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, "../resolvers/getNotes.req.vtl")
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, "../resolvers/getNotes.res.vtl")
      ),
    });

    dataSource.createResolver("GetNotesStatsQuery", {
      typeName: "Query",
      fieldName: "getNotesStats",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, "../resolvers/getNotesStats.req.vtl")
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, "../resolvers/getNotesStats.res.vtl")
      ),
    });
  }
}
