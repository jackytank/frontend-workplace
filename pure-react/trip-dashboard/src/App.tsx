import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { HvProvider, createTheme } from '@hitachivantara/uikit-react-core';
import router from './routers';
import Toast from './components/Toasts';

function App() {
  const newTheme = createTheme({
    name: 'myTheme',
    base: 'ds5',
    inheritColorModes: true,
    fontFamily: {
      body: 'NotoSansJP'
    }
  });

  useEffect(() => {
  }, []);

  return (
    <HvProvider rootElementId="root" themes={[newTheme]}>
      <Suspense fallback={<div>Loading......</div>}>
        <RouterProvider router={router} />
        <Toast />
      </Suspense>
    </HvProvider>
  );
}

export default App;
