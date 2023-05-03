import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import RouterConfig from "./router";
import { client, ApolloProvider } from "./lib/apollo";
// import ErrorBoundary from "./components/error-boundary";
import "./polyfill";
import "./pages/recet.css";

const root = document.querySelector("#root");
if (root) {
    createRoot(root).render(
        <StrictMode>
            <ApolloProvider client={client}>
                <RouterConfig />
            </ApolloProvider>
        </StrictMode>
    );
}
