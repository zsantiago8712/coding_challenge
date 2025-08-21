#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NotesBackendStack } from '../lib/backend-stack';

const app = new cdk.App();

try {
    console.log('Creating backend stack...');

    const backendStack = new NotesBackendStack(app, 'TestBackendStack', {
        env: {
            account: process.env.CDK_DEFAULT_ACCOUNT,
            region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
        },
    });

    console.log('Backend stack created successfully!');

    // Verificar cada propiedad individualmente
    console.log('Checking stack properties...');
    console.log('- notesTable:', !!backendStack.notesTable);
    console.log('- graphqlApi:', !!backendStack.graphqlApi);
    console.log('- identityPool:', !!backendStack.identityPool);

    if (backendStack.graphqlApi) {
        console.log('GraphQL API details:');
        console.log('  - apiId:', backendStack.graphqlApi.apiId);
        console.log('  - graphqlUrl:', backendStack.graphqlApi.graphqlUrl);
    } else {
        console.log('⚠️  GraphQL API is null/undefined!');
    }

    if (backendStack.identityPool) {
        console.log('Identity Pool details:');
        console.log('  - ref:', backendStack.identityPool.ref);
    } else {
        console.log('⚠️  Identity Pool is null/undefined!');
    }

    console.log('\nTesting getters:');
    try {
        const endpoint = backendStack.graphQlEndpoint;
        console.log('✅ GraphQL Endpoint getter:', endpoint);
    } catch (e: any) {
        console.error('❌ Error getting GraphQL endpoint:', e.message);
    }

    try {
        const poolId = backendStack.identityPoolId;
        console.log('✅ Identity Pool ID getter:', poolId);
    } catch (e: any) {
        console.error('❌ Error getting Identity Pool ID:', e.message);
    }

    // Intentar synth para ver si hay errores en la construcción
    console.log('\nTesting CDK synth...');
    try {
        app.synth();
        console.log('✅ CDK synth completed successfully');
    } catch (synthError: any) {
        console.error('❌ CDK synth failed:', synthError.message);
        throw synthError;
    }
} catch (error: any) {
    console.error('❌ Error creating backend stack:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
}
