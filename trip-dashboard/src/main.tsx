import React from 'react';
import ReactDOM from 'react-dom/client';
import { HvSnackbarProvider } from '@hitachivantara/uikit-react-core';
import { Provider } from 'react-redux';
import App from './App';
import store from './app/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HvSnackbarProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </HvSnackbarProvider>
  </React.StrictMode>
);
