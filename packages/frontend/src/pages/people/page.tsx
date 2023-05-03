import  { FC, Suspense } from "react";
import { useAllPeople } from "./query";

const Loading = ()=> <p>Loading</p>

const AllPeople: FC = () =>{
    const {  error, data } = useAllPeople(
        { first: 10 }
    );
    if (error) return <p>Error : {error.message}</p>;

    return (
        <>
            <h1>PageInfo</h1>
            {JSON.stringify(data?.pageInfo)}
            <h1>Edges</h1>
            <ul>
                {data?.edges?.map((edge) => {
                    return <li key={edge?.cursor}>{JSON.stringify(edge?.node)}</li>;
                })}
            </ul>
        </>
    );
}
const Page: FC = () => {
    return (
        <Suspense fallback={<Loading />}>
          <AllPeople />
        </Suspense>
      );
};

export default Page;
