import { DesktopOutlined, UserOutlined, TeamOutlined, InsuranceTwoTone, UsergroupAddOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Layout, Menu, MenuProps, Spin, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { toastInfo } from "../utils/toastify";
import { ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.min.css';
import { useSelector } from "react-redux";
import { RootState } from "../Store";

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    path?: string,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label: <Link to={path as string}>{label}</Link>,
        path,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem("Home", "1", <DesktopOutlined />, "/", undefined),
    getItem("Employee", "2", <UsergroupAddOutlined />, undefined,
        [
            getItem("List", "3", <TeamOutlined />, "employees/list", undefined),
            getItem("Detail", "4", <UserOutlined />, "employees/detail", undefined)
        ]),
    getItem("About", "5", <QuestionCircleOutlined />, "/about", undefined),
];

const Root = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer } } = theme.useToken();
    const { isLoading } = useSelector((store: RootState) => store.common);

    useEffect(() => {
        toastInfo('Welcome to here!');
    }, []);

    return (
        <>
            <Spin spinning={isLoading}>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                        <div className="demo-logo-vertical">
                            <InsuranceTwoTone style={{ fontSize: '70px', margin: '15px auto', display: 'block' }} />
                        </div>
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
                    </Sider>
                    <Layout>
                        <Header style={{ padding: 0, background: colorBgContainer }} />
                        <Content
                            style={{
                                margin: '24px 16px',
                                padding: 24,
                                minHeight: 280,
                                background: colorBgContainer,
                            }}
                        >
                            <Outlet />
                            <ToastContainer />
                        </Content>
                    </Layout>
                </Layout>
            </Spin>
        </>
    );
};

export default Root;