import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatWindow from './ChatWindow'; // ✅ import new chat component

function ConnectedUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/connections', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch connected users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Connected Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <button onClick={() => setSelectedUser(user)}>
              {user.username}
            </button>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <ChatWindow user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}

export default ConnectedUsers;
