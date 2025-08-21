import 'dotenv/config';
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: '../backend/schema/schema.graphql',
    documents: [
        'src/**/*.{ts,tsx}',
        '!src/lib/graphql/**/*', // Excluir archivos generados
    ],
    ignoreNoDocuments: true,
    overwrite: true,
    generates: {
        './src/lib/graphql/': {
            preset: 'client',
            config: {
                documentMode: 'string',
            },
        },
    },
};

export default config;
