import { query } from "../../common/pagination";
import type { Resolvers } from "../types";
import { toPerson } from "./transform";
import { data as peopleData } from "./test-data";

export const resolvers: Resolvers = {
    Query: {
        allPeople: async (_, args) => {
            return await query(args, "people", {
                firstTimeQuery: async ({ first }) => {
                    const resultPeople = peopleData.slice(0, first).map(toPerson);
                    return {
                        totalCount: peopleData.length,
                        nodes: resultPeople,
                    };
                },
                forwardQuery: async ({ after, first }) => {
                    const peopleIndex = peopleData.findIndex((p) => p.id === after);

                    const resultPeople =
                        peopleIndex === -1
                            ? peopleData.slice(0, first)
                            : peopleData.slice(peopleIndex + 1, peopleIndex + 1 + first);
                    return {
                        totalCount: peopleData.length,
                        nodes: resultPeople.map(toPerson),
                    };
                },
                backwardQuery: async ({ before, last }) => {
                    const reversedPeopleData = peopleData.slice().reverse();
                    const peopleIndex = reversedPeopleData.findIndex(
                        (p) => p.id === before
                    );

                    const resultPeople =
                        peopleIndex === -1
                            ? reversedPeopleData.slice(0, last)
                            : reversedPeopleData.slice(
                                  peopleIndex + 1,
                                  peopleIndex + 1 + last
                              );
                    return {
                        totalCount: reversedPeopleData.length,
                        nodes: resultPeople.map(toPerson),
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
