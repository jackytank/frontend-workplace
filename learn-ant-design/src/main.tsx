import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './main.css';
import ErrorPage from './error-page.tsx';
import MainLayout from './routes/main-layout.tsx';
import PlayGround from './routes/playground/playground.tsx';
import { Provider } from 'react-redux';
import { store } from './store.ts';
import PokemonSWR from './routes/applications/pokemon/pokemon-swr.component.tsx';
import Home from './routes/home.tsx';

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
          path: 'applications',
          children: [
            {
              path: 'pokemon',
              element: <PokemonSWR />
            },
            // {
            //   path: 'detail',
            //   element: <EmployeeDetail />
            // }
          ]
        },
        // {
        //   path: 'projects',
        //   children: [
        //     {
        //       path: 'list',
        //       element: <ProjectList />
        //     },
        //   ]
        // },
        {
          path: 'todos',
          element: <>To be implemented...</>
        },
        {
          path: 'playground',
          element: <PlayGround />
        },
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
