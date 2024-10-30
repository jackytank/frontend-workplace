import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://54.160.217.119:8080/api/v1/sqs');
        console.log(response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: string[] = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>SQS Messages</h1>
      <ul>
        {JSON.stringify(messages, null, 2)}
      </ul>
    </div>
  );
};

export default App;
