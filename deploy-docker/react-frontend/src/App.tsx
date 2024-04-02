/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { Button, Card, Image, List } from 'antd';
import { useFetchUsers } from './hooks/useFetchUsers';

function App() {
  const [count, setCount] = useState(0);
  const { data: users, loading, error } = useFetchUsers('http://localhost/api/v1/users');

  // Handle the error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div style={{
        // Center the content
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '1rem',
      }}>
        <Card>
          <Image src={reactLogo} className="app-logo" alt="react logo" />
          <Image src={viteLogo} className="app-logo" alt="vite logo" />
        </Card>
        <Card title={<h1>Vite + React</h1>}>
          <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </Card>
        <List
          loading={loading}
          itemLayout='horizontal'
          dataSource={users}
          renderItem={user => (
            <List.Item>
              <List.Item.Meta
                title={user.name}
                description={user.email}
              />
            </List.Item>
          )}
        />
      </div>
    </>
  );
}

export default App;
