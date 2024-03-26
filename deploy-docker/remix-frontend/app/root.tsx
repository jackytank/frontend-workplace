import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Menu, MenuProps } from "antd";
import { useRef } from "react";

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

export default function App() {
  const items: MenuProps['items'] = [
    {
      label: (
        <a href="/user" rel="noopener noreferrer">
          User
        </a>
      ),
      key: 'User',
    },
    {
      label: (
        <a href="/employee" rel="noopener noreferrer">
          Employee
        </a>
      ),
      key: 'Employee',
    }
  ];
  const cur = useRef('User');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    cur.current = e.key;
  };
  return (
    <>
      <div>
        <Menu onClick={onClick} selectedKeys={[cur.current]} mode="horizontal" items={items} />
        <Outlet />
      </div>
    </>
  );
}
