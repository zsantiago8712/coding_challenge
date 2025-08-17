import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import { Construct } from "constructs";
import * as path from "path";

export class NotesBackendStack extends cdk.Stack {
  public readonly graphqlApi: appsync.GraphqlApi;
  public readonly notesTable: dynamodb.Table;

  /**
   * Constructs a new NotesBackendStack.
   *
   * @param {Construct} scope - The parent scope.
   * @param {string} id - The ID of the stack.
   * @param {cdk.StackProps} [props] - Optional stack properties.
   */
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
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
    });

    const notesDataSource = this.graphqlApi.addDynamoDbDataSource(
      "NotesDataSource",
      this.notesTable
    );

    this.createResolvers(notesDataSource);

    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: this.graphqlApi.graphqlUrl,
      description: "GraphQL API URL",
    });

    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: this.graphqlApi.apiKey || "",
      description: "GraphQL API Key",
    });

    new cdk.CfnOutput(this, "GraphQLAPIId", {
      value: this.graphqlApi.apiId,
      description: "GraphQL API ID",
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
  }
}
