import {
    useSuspenseQuery_experimental,
    UseSuspenseQueryResult,
    gql,
} from "@apollo/client";
import type { Query, QueryPersonArgs } from "../../../gql/graphql";

const ALL_PEOPLE = gql`
    query person($id: ID!) {
        person(id: $id) {
            id
            name
        }
    }
`;

export const usePerson = (
    variables: QueryPersonArgs
): UseSuspenseQueryResult<{ person: Query["person"] }, QueryPersonArgs> =>
    useSuspenseQuery_experimental<{ person: Query["person"] }, QueryPersonArgs>(
        ALL_PEOPLE,
        {
            variables,
        }
    );
