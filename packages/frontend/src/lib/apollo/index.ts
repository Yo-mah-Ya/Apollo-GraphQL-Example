import { ApolloClient, InMemoryCache, SuspenseCache } from "@apollo/client";
export { ApolloProvider } from "@apollo/client";

export const client = new ApolloClient({
    uri: process.env.CDN_ENDPOINT,
    cache: new InMemoryCache(),
});
export const suspenseCache = new SuspenseCache();
