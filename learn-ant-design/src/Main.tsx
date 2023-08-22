import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './Main.css';
import ErrorPage from './ErrorPage.tsx';
import Home from './routes/Home.tsx';
import MainLayout from './routes/MainLayout.tsx';
import About from './routes/About.tsx';
import EmployeeList from './routes/employee/employee-list/EmployeeList.tsx';
import EmployeeDetail from './routes/employee/employee-detail/EmployeeDetail.tsx';
import { Provider } from 'react-redux';
import { store } from './Store.ts';
import ProjectList from './routes/project/project-list/ProjectList.tsx';

const router = createBrowserRouter([{
  path: '/',
  element: <MainLayout />,
  errorElement: <ErrorPage />,
  children: [
    {
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: 'employees',
          children: [
            {
              path: 'list',
              element: <EmployeeList />
            },
            {
              path: 'detail',
              element: <EmployeeDetail />
            }
          ]
        },
        {
          path: 'projects',
          children: [
            {
              path: 'list',
              element: <ProjectList />
            },
          ]
        },
        {
          path: 'todos',
          element: <EmployeeDetail />
        },
        {
          path: 'about',
          element: <About />
        }
      ]
    }
  ]
}]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
