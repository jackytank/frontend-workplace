import { DesktopOutlined, QuestionCircleOutlined, WindowsOutlined } from "@ant-design/icons";
import { Col, Layout, Menu, MenuProps, Row, Spin, Switch } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
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
    getItem("Home", "1", <DesktopOutlined />, "/"),
    // getItem("Employee", "2", <UsergroupAddOutlined />, undefined,
    //     [
    //         getItem("List", "3", <UnorderedListOutlined />, "employees/list", undefined),
    //         getItem("Detail", "4", <UserOutlined />, "employees/detail", undefined)
    //     ]),
    // getItem("Project", "5", <FolderOutlined />, undefined,
    //     [
    //         getItem("List", "6", <UnorderedListOutlined />, "projects/list", undefined),
    //     ]),
    getItem("PlayGround", "7", <QuestionCircleOutlined />, "/playground"),
];

const color = {
    light: '#f0f0f0',
    dark: '#001529'
};

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { isLoading } = useSelector((store: RootState) => store.common);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const onChange = (checked: boolean) => {
        setTheme(checked ? 'dark' : 'light');
        console.log(`switch to ${theme}`);
    };

    return (
        <>
            <Spin spinning={isLoading}>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider theme={theme} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                        <div className="demo-logo-vertical">
                            <WindowsOutlined style={{ fontSize: '30px', margin: '15px auto', display: 'block', color: 'DodgerBlue' }} />
                        </div>
                        <Menu theme={theme} defaultSelectedKeys={['1']} mode="inline" items={items} />
                    </Sider>
                    <Layout>
                        <Header style={{
                            padding: '0 15px',
                            backgroundColor: theme === 'light' ? color.light : color.dark
                        }}
                        >
                            <Row
                                justify={'end'}
                                align={'middle'}
                            >
                                <Col>
                                    <Switch checkedChildren="Dark" unCheckedChildren="Light" onChange={onChange} />
                                </Col>
                            </Row>
                        </Header>
                        <Content
                            style={{
                                margin: '0px 0px',
                                padding: 24,
                                minHeight: '100vh',
                                backgroundColor: theme === 'light' ? color.light : color.dark
                            }}
                        >
                            <div style={{ backgroundColor: color.light, padding: '15px' }}>
                                <Outlet />
                            </div>
                            <ToastContainer />
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>React ©2023 Created by jackytank</Footer>
                    </Layout>
                </Layout>
            </Spin>
        </>
    );
};

export default MainLayout;