import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: "http://localhost:3000/graphql",
    documents: undefined,
    generates: {
        "./src/resolvers/types.ts": {
            plugins: [
                { add: { content: "/* eslint-disable */" } },
                "typescript",
                "typescript-resolvers",
            ],
            config: {
                noSchemaStitching: true,
                useIndexSignature: true,
                namingConvention: { enumValues: "keep" },
                maybeValue: "T | undefined",
            },
        },
        "./src/resolvers/schema.json": {
            plugins: ["introspection"],
        },
    },
};

export default config;
