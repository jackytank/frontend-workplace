import React, { lazy } from 'react';

const Setting = lazy(() => import('../pages/setting/setting'));
const DiaManMachine = lazy(() => import('../pages/dia-man-machine/diaManMachine.js'));
const ErrorPage = lazy(() => import('../pages/Error/Error.js'));

export const routes = [
  {
    path: 'setting',
    component: <Setting />,
    private: false
  },
  {
    path: 'diamanmachine',
    component: <DiaManMachine />,
    private: false
  },
  {
    path: '',
    component: <Setting />,
    private: false
  },
  {
    path: '*',
    component: <ErrorPage />,
    private: false
  }
];
