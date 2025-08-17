import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";

const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
const identityPoolId = process.env.NEXT_PUBLIC_IDENTITY_POOL_ID;
const region = process.env.NEXT_PUBLIC_AWS_REGION;

if (!graphqlEndpoint) {
  throw new Error("NEXT_PUBLIC_GRAPHQL_ENDPOINT is not defined");
}

if (!identityPoolId) {
  throw new Error("NEXT_PUBLIC_IDENTITY_POOL_ID is not defined");
}

if (!region) {
  throw new Error("NEXT_PUBLIC_AWS_REGION is not defined");
}

const config = {
  API: {
    GraphQL: {
      endpoint: graphqlEndpoint,
      region: region,
      defaultAuthMode: "identityPool" as const,
    },
  },
  Auth: {
    Cognito: {
      identityPoolId: identityPoolId,
      allowGuestAccess: true,
    },
  },
};

Amplify.configure(config);

export const graphqlClient = generateClient();
