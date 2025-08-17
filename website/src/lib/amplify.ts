import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";

const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
const graphqlApiKey = process.env.NEXT_PUBLIC_GRAPHQL_API_KEY;
const region = process.env.NEXT_PUBLIC_AWS_REGION;

if (!graphqlEndpoint) {
  throw new Error("NEXT_PUBLIC_GRAPHQL_ENDPOINT is not defined");
}

if (!graphqlApiKey) {
  throw new Error("NEXT_PUBLIC_GRAPHQL_API_KEY is not defined");
}

if (!region) {
  throw new Error("NEXT_PUBLIC_AWS_REGION is not defined");
}

const config = {
  API: {
    GraphQL: {
      endpoint: graphqlEndpoint,
      region: region,
      defaultAuthMode: "apiKey" as const,
      apiKey: graphqlApiKey,
    },
  },
};

Amplify.configure(config);

export const graphqlClient = generateClient();
