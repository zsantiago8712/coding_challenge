#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NotesBackendStack } from '../lib/backend-stack';
import { AmplifyHostingStack } from '../lib/amplify-hosting-stack';

const app = new cdk.App();

// Configuración desde context o variables de entorno
const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION || 'us-east-1';
const repository = process.env.GITHUB_REPOSITORY || 'zsantiago8712/coding_challenge';
const branchName = process.env.BRANCH_NAME || 'main';
const gitHubToken = process.env.GITHUB_TOKEN;

if (gitHubToken) {
    console.log('GitHub token found in environment variables');
} else {
    console.log('GitHub token not found in environment variables');
}

// Stack del backend (API + DynamoDB) - Usando el nombre existente
const backendStack = new NotesBackendStack(app, 'BackendStack', {
    env: { account, region },
    description: 'Backend infrastructure for Notes Sentiment App (API + Database)',
});

// Debug: verificar que las propiedades estén disponibles
console.log('Backend stack properties:', {
    hasGraphqlApi: !!backendStack.graphqlApi,
    hasIdentityPool: !!backendStack.identityPool,
});

// Función para crear el hosting stack después de que el backend esté completamente construido
function createHostingStack() {
    return new AmplifyHostingStack(app, 'HostingStack', {
        env: { account, region },
        description: 'Frontend hosting for Notes Sentiment App (Amplify)',
        repository,
        branchName,
        appRoot: 'website',
        graphQlEndpoint: backendStack.graphQlEndpoint,
        identityPoolId: backendStack.identityPoolId,
        region,
        gitHubToken,
    });
}

// Stack del hosting (Amplify) - crear después del backend
const hostingStack = createHostingStack();

// El hosting depende del backend
hostingStack.addDependency(backendStack);

// Tags para organización
cdk.Tags.of(app).add('Project', 'NotesSentimentApp');
cdk.Tags.of(app).add('Environment', branchName === 'main' ? 'production' : 'development');
cdk.Tags.of(app).add('ManagedBy', 'CDK');
