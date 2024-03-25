import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Layout as AntLayout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";

export function Layout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const AntDesignLayoutWrapper = ({ children }: { children: React.ReactNode; }) => {
  return (
    <>
      <AntLayout>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            // items={items}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
        <Content style={{ padding: '0 48px' }}>
          <div
            style={{
              minHeight: 280,
              padding: 24,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Uncle T ©{new Date().getFullYear()} Created by Uncle T
        </Footer>
      </AntLayout>
    </>
  );
};

export default function App() {
  return (
    <>
      <AntDesignLayoutWrapper>
        <Outlet />
      </AntDesignLayoutWrapper>
    </>
  );
}
