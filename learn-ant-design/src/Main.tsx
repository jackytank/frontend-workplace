import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import ErrorPage from './ErrorPage.tsx';
import Index from './routes/Index.tsx';
import Root from './routes/Root.tsx';
import About from './routes/About.tsx';
import EmployeeList from './routes/employee/EmployeeList.tsx';
import EmployeeDetail from './routes/employee/EmployeeDetail.tsx';
import { Provider } from 'react-redux';
import { store } from './Store.ts';

const router = createBrowserRouter([{
  path: '/',
  element: <Root />,
  errorElement: <ErrorPage />,
  children: [
    {
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Index />
        },
        {
          path: 'employees/list',
          element: <EmployeeList />
        },
        {
          path: 'employees/detail',
          element: <EmployeeDetail />
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
