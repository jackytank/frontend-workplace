import { HvProvider } from '@hitachivantara/uikit-react-core';
import './App.css';
import AppRouter from './router';
import { createTheme } from '@hitachivantara/uikit-react-core';
import { useEffect } from 'react';

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
    global.timetable = {} as any;
  }, []);

  return (
    <HvProvider rootElementId="root" themes={[newTheme]}>
      <AppRouter />
    </HvProvider>
  );
}

export default App;
