import { useSuspenseQuery_experimental, UseSuspenseQueryResult, gql } from "@apollo/client";
import type { Query, QueryAllPeopleArgs } from "../../gql/graphql";

const ALL_PEOPLE = gql`
    query allPeople($first: Int) {
        allPeople(first: $first) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                endCursor
                startCursor
            }
            totalCount
            edges {
                cursor
                node {
                    id
                    name
                }
            }
            nodes {
                id
                name
            }
        }
    }
`;

interface QueryResultProcessed extends UseSuspenseQueryResult {
    data: Query["allPeople"];
}
export const useAllPeople = (variables: QueryAllPeopleArgs): QueryResultProcessed => {
    const response = useSuspenseQuery_experimental<{ allPeople: Query["allPeople"] }, QueryAllPeopleArgs>(
        ALL_PEOPLE,
        {
            variables,
        }
    );
    return {
        ...response,
        data: response.data?.allPeople,
    };
};
