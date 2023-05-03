import { query } from "../../common/pagination";
import type { Resolvers } from "../types";

export const resolvers: Resolvers = {
    Query: {
        allPeople: async (_, args) => {
            return await query(args, "people", {
                firstTimeQuery: async (args) => {
                    args;
                    return {
                        totalCount: 0,
                        nodes: [],
                    };
                },
                forwardQuery: async (args) => {
                    args;
                    return {
                        totalCount: 0,
                        nodes: [],
                    };
                },
                backwardQuery: async (args) => {
                    args;
                    return {
                        totalCount: 0,
                        nodes: [],
                    };
                },
            });
        },
    },
    // Person: {
    //     filmConnection: async (parent, args, { dataSources }: ServiceContext) => {
    //         return {
    //             pageInfo: {
    //                 hasPreviousPage: false,
    //                 hasNextPage: first <= [].length,
    //                 ...responseCursor([]),
    //             },
    //             totalCount: 0,
    //             nodes: [],
    //             edges: [],
    //         };
    //     },
    // },
};
