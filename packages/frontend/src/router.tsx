import type { FC } from "react";
import { Routes, Route, Outlet, BrowserRouter } from "react-router-dom";
import FilmsPage from "./pages/films/page";
import PeoplePage from "./pages/people/page";
import PersonPage from "./pages/people/[id]/page";
import PlanetsPage from "./pages/planets/page";
import SpeciesPage from "./pages/species/page";
import VehiclesPage from "./pages/vehicles/page";

const DefaultLayout = () => (
    <>
        <main>
            <Outlet />
        </main>
    </>
);

const RouterConfig: FC = () => (
    <BrowserRouter>
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route path="/films" element={<FilmsPage />} caseSensitive />
                <Route
                    path="/people"
                    element={
                        <>
                            <PeoplePage />
                            <Outlet />
                        </>
                    }
                    caseSensitive
                >
                    <Route path=":id" element={<PersonPage />} caseSensitive />
                </Route>
                <Route path="/planets" element={<PlanetsPage />} caseSensitive />
                <Route path="/species" element={<SpeciesPage />} caseSensitive />
                <Route path="/vehicles" element={<VehiclesPage />} caseSensitive />
            </Route>
        </Routes>
    </BrowserRouter>
);

export default RouterConfig;
