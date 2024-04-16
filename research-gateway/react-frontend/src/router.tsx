import { Navigate, createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/main-layout";
import { myconfig } from "./config";
import AnalysisPage from "./pages/analysis/analysis-page";

const router = createBrowserRouter([
    {
        path: myconfig.API.INDEX,
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to={myconfig.API.ANALYSIS.INDEX} />,
            },
            {
                path: myconfig.API.ANALYSIS.INDEX,
                element: <AnalysisPage />,
            },
            {
                path: '*',
                element: <Navigate to={myconfig.API.INDEX} />
            }
        ]
    },
]);

export { router };