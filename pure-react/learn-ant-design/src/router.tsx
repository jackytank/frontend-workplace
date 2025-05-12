import ErrorPage from './error-page.tsx';
import MainLayout from './routes/main-layout.tsx';
import PlayGround from './routes/playground/playground.tsx';
import Home from './routes/home.tsx';
import { createBrowserRouter } from 'react-router';
import ChartJs from './routes/visualization/chartjs/chartjs.tsx';

export const router = createBrowserRouter([{
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
          path: 'visualization',
          children: [
            {
              path: 'chartjs',
              element: <ChartJs />
            }
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