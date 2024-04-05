import { Navigate, createBrowserRouter } from "react-router-dom";
import UserPage, { loader as userLoader } from "./pages/user-page";
import EmployeePage from "./pages/employee-page";
import MainLayout from "./layout/main-layout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/user" />,
            },
            {
                path: "user",
                element: <UserPage />,
                loader: userLoader
            },
            {
                path: "employee",
                element: <EmployeePage />,
            }
        ]
    },
]);

export { router };