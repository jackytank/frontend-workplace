import { useRouteError } from "react-router";

interface RouteErrorResponse {
    statusText: string;
    message: string;
}
const ErrorPage = () => {
    const error = useRouteError() as RouteErrorResponse;

    return (
        <>
            <div>ErrorPage</div>
            <div>{error.statusText}</div>
            <div>{error.message}</div>
        </>
    );
};

export default ErrorPage;