import { Navigate, createBrowserRouter } from "react-router-dom";
import UserPage, { loader as userLoader } from "./pages/user/user-page";
import ChatPage from "./pages/chat/chat-page";
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
                path: "message",
                element: <ChatPage />,
            }
        ]
    },
]);

export { router };