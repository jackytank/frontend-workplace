import { Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <>
            <Layout>
                <Header style={{ display: 'flex', alignItems: 'center' }}>
                    <div>
                        Gia Lô
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        items={[
                            {
                                key: '1',
                                label: <Link to={'/user'}>User</Link>,
                            },
                            {
                                key: '2',
                                label: <Link to={'/chat'}>Chat</Link>,
                            },
                            {
                                key: '3',
                                label: <Link to={'/improved-chat'}>Improved Chat</Link>,
                            }
                        ]}
                        style={{ flex: 1, minWidth: 0 }}
                    />
                </Header>
                <Content style={{ padding: '0 48px' }}>
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
                </Content>
            </Layout>
        </>
    );
};

export default MainLayout;