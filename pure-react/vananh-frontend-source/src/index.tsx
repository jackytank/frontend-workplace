import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import './lib/i18n';
import { store } from './redux/config-store';
import { AxiosInterceptor } from './services/apis/auth.interceptor';
import { HvSnackbarProvider } from '@hitachivantara/uikit-react-core';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HvSnackbarProvider>
        <AxiosInterceptor>
          <App />
        </AxiosInterceptor>
      </HvSnackbarProvider>
    </Provider>
  </React.StrictMode>
);
