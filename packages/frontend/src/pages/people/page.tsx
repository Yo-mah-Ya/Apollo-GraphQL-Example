import { FC, Suspense, useCallback, useRef } from "react";
import { ALL_PEOPLE } from "./query";
import CursorSelection from "../../components/cursor";
import style from "./style.module.scss";
import { useSuspenseQuery_experimental } from "@apollo/client";
import type { Query, QueryAllPeopleArgs } from "../../gql/graphql";

const Loading = () => <p>Loading</p>;

const AllPeople: FC = () => {
    const orderRef = useRef<HTMLSelectElement>(null);
    const lengthRef = useRef<HTMLInputElement>(null);
    const cursorRef = useRef<HTMLInputElement>(null);

    const toVariables = useCallback(
        ({ length, cursor }: { length: number; cursor?: string }) => {
            const order = orderRef.current?.value;
            return order === "first"
                ? { first: length }
                : order === "forward"
                ? { after: cursor, first: length }
                : order === "backward"
                ? { before: cursor, last: length }
                : { first: length };
        },
        []
    );
    const {
        error,
        data: { allPeople },
        fetchMore,
    } = useSuspenseQuery_experimental<
        { allPeople: Query["allPeople"] },
        QueryAllPeopleArgs
    >(ALL_PEOPLE, {
        variables: {
            first: 10,
        },
    });

    const load = useCallback(() => {
        const length = lengthRef.current?.value;
        const cursor = cursorRef.current?.value;

        if (!length) return;
        const n = Number(length);
        if (Number.isNaN(n)) return;

        fetchMore({
            variables: toVariables({
                length: n,
                cursor,
            }),
        });
    }, []);

    if (error) return <p>Error : {error.message}</p>;

    return (
        <>
            <div>
                <CursorSelection
                    orderRef={orderRef}
                    cursorRef={cursorRef}
                    lengthRef={lengthRef}
                />
                <button className={style.button} onClick={load}>
                    AllPeople Query
                </button>
            </div>
            <h1>allPeople</h1>
            {JSON.stringify(allPeople?.pageInfo)}
            <h1>Edges</h1>
            <ul>
                {allPeople?.edges?.map((edge) => {
                    return <li key={edge?.cursor}>{JSON.stringify(edge)}</li>;
                })}
            </ul>
        </>
    );
};
const Page: FC = () => {
    return (
        <Suspense fallback={<Loading />}>
            <AllPeople />
        </Suspense>
    );
};

export default Page;
