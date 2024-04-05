import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <>
            <h1>React App</h1>
            <ul
                style={{
                    listStyle: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    padding: 0
                }}
            >
                <li>
                    <Link to={'/user'}>User</Link>
                </li>
                <li>
                    <Link to={'/employee'}>Employee</Link>
                </li>
            </ul>
            <br />
            <div>
                <Outlet />
            </div>
        </>
    );
};

export default MainLayout;