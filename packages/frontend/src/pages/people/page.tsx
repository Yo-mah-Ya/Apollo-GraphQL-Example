import type { FC } from "react";
import { useQuery, gql } from "@apollo/client";
import type { Query } from "../../gql/graphql";

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

const Page: FC = () => {
    const { loading, error, data } = useQuery<{ allPeople: Query["allPeople"] }>(
        ALL_PEOPLE,
        {
            variables: { first: 10 },
        }
    );
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    return (
        <>
            <h1>PageInfo</h1>
            {JSON.stringify(data?.allPeople?.pageInfo)}
            <h1>Edges</h1>
            <ul>
                {data?.allPeople?.edges?.map((edge) => {
                    return <li key={edge?.cursor}>{JSON.stringify(edge?.node)}</li>;
                })}
            </ul>
        </>
    );
};

export default Page;
