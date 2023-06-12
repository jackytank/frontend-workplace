import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, LoaderFunction, RouterProvider } from 'react-router-dom';
import Root, { loader as rootLoader, action as rootAction } from './routes/root';
import ErrorPage from './error-page';
import Contact, { loader as contactLoader, action as contactAction } from './routes/contact';
import EditContact, { action as editAction } from './routes/edit';
import './index.css';
import { action as destroyAction } from './routes/destroy';
import Index from './routes';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Index />
          },
          {
            path: 'contacts/:contactId',
            element: <Contact />,
            loader: contactLoader as unknown as LoaderFunction,
            action: contactAction as unknown as LoaderFunction
          },
          {
            path: 'contacts/:contactId/edit',
            element: <EditContact />,
            loader: contactLoader as unknown as LoaderFunction,
            action: editAction as unknown as LoaderFunction
          },
          {
            path: 'contacts/:contactId/destroy',
            action: destroyAction as unknown as LoaderFunction,
            errorElement: <div>Oops! There was an error when destroy contact!</div>
          }
        ]
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
