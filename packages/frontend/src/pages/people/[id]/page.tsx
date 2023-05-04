import { FC, Suspense } from "react";
import { useParams } from "react-router-dom";
import { usePerson } from "./query";

const Loading = () => <p>Loading</p>;

const AllPeople: FC = () => {
    const { id } = useParams();
    const { error, data } = usePerson({ id });
    if (error) return <p>Error : {error.message}</p>;

    return (
        <>
            <h1>data</h1>
            {JSON.stringify(data)}
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
