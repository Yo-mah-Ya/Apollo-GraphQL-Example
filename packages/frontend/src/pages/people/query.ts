import { gql } from "@apollo/client";

export const ALL_PEOPLE = gql`
    query allPeople($after: String, $first: Int, $before: String, $last: Int) {
        allPeople(after: $after, first: $first, before: $before, last: $last) {
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
