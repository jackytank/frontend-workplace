import React from 'react';

async function getUsers() {
  const res = await fetch('http://localhost:8080/users');
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

const UserPage = async () => {
  const data: UserType[] = await getUsers();
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserPage;