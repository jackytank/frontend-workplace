import { Navigate, createBrowserRouter } from "react-router-dom";
import UserPage, { loader as userLoader } from "./pages/user/user-page";
import ChatPage from "./pages/chat/chat-page";
import MainLayout from "./layout/main-layout";
import { myconfig } from "./config";

const router = createBrowserRouter([
    {
        path: myconfig.api.index,
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to={myconfig.api.user.index} />,
            },
            {
                path: myconfig.api.user.index,
                element: <UserPage />,
                loader: userLoader
            },
            {
                path: myconfig.api.chat.index,
                children: [
                    {
                        index: true,
                        element: <ChatPage />,
                    },
                ]
            },
            {
                path: '*',
                element: <Navigate to={myconfig.api.chat.index} />
            }
        ]
    },
]);

export { router };