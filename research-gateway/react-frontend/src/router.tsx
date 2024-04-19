import { Navigate, createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/main-layout";
import { constants } from "./constants/constants";
import AnalysisPage from "./pages/analysis/analysis-page";
import NotFound from "./components/NotFound/NotFound";
import Home from "./pages/home/home";

const router = createBrowserRouter([
    {
        path: constants.ROUTING.INDEX,
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to={constants.ROUTING.HOME} />,
            },
            {
                path: constants.ROUTING.HOME,
                element: <Home />,
            },
            {
                path: constants.ROUTING.ANALYSIS,
                element: <AnalysisPage />,
            },
            {
                path: '*',
                element: <NotFound />,
            }
        ]
    },
]);

export { router };