import { v4 as uuid } from 'uuid';
import {
  createBrowserRouter,
} from 'react-router-dom';
import { ROUTER_ENUM } from './Router.enum';
import { lazy } from 'react';
import MainLayout from '../layouts/main-layout';
const PageNotFound = lazy(() => import('../pages/PageNotFound'));

const router = createBrowserRouter([
  {
    id: uuid(),
    path: '/',
    element: <MainLayout />,
    // routes: [
    //   {
    //     id: uuid(),
    //     path: ROUTER_ENUM.LOGIN,
    //     loader: () => { },
    //     children: [
    //       {
    //         id: uuid(),
    //         path: ROUTER_ENUM.DEFAULT,
    //         element: <div />,
    //         loader: () => { },
    //         index: false,
    //       },
    //     ],
    //   },
    // ],
    children: [
      {
        children: [
          {
            path: ROUTER_ENUM.KPI,
            element: <h2>kpi</h2>,
          },
          {
            path: ROUTER_ENUM.INTERVENTION,
            element: <h2>intervention</h2>,
          },
          {
            path: ROUTER_ENUM.USER,
            element: <h2>user</h2>,
          },
        ]
      }
    ]
  },
  {
    id: uuid(),
    path: ROUTER_ENUM.NOT_FOUND,
    element: <PageNotFound />,
  },
]);

export default router;