import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider, useLoaderData } from 'react-router-dom';

type User = {
  id: number;
  name: string;
};

type Group = {
  id: number;
  name: string;
};

export const fetchData = async () => {
  return {
    users: [
      {
        id: 1,
        name: 'Alice'
      },
      {
        id: 2,
        name: 'Bob'
      }
    ] as User[],
    groups: [
      {
        id: 1,
        name: 'Group 1'
      },
      {
        id: 2,
        name: 'Group 2'
      }
    ] as Group[]
  };
};

const UserList = () => {
  const data = useLoaderData() as { users: User[]; };
  return (
    <ul>
      {data.users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

const GroupList = () => {
  const data = useLoaderData() as { groups: Group[]; };
  return (
    <ul>
      {data.groups.map(group => (
        <li key={group.id}>{group.name}</li>
      ))}
    </ul>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>
      Home
      <nav>
        <a href="/users">Users</a>
        <a href="/groups">Groups</a>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>,
    errorElement: <div>Something went wrong</div>,
    children: [
      {
        path: '/users',
        index: true,
        loader: fetchData,
        element: <UserList />
      },
      {
        path: '/groups',
        loader: fetchData,
        element: <GroupList />
      },
      {
        path: '*',
        element: <div>Not Found</div>
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
