import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <>
            <h1 style={{
                textAlign: 'center',
                color: 'blue',
            }}
            >
                Gia Lôw
            </h1>
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
                    <Link to={'/chat'}>Chat</Link>
                </li>
            </ul>
            <br />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'start',
                height: '100vh',
                gap: '1rem',
            }}>
                <Outlet />
            </div>
        </>
    );
};

export default MainLayout;