import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NearbyUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNearbyUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/nearby', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.error || 'Failed to load users');
      }
    };

    fetchNearbyUsers();
  }, []);

  const handleConnect = async (receiverId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:5000/api/users/connect',
      { receiverId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert('Connection request sent!');
  } catch (err) {
    alert(err.response?.data?.message || 'Error sending request');
  }
};

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Nearby Users</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.username}</strong> ({user.email})
              <button onClick={() => handleConnect(user.id)} style={{ marginLeft: '1rem' }}>
                Connect
             </button>
            {/* Add connect button later */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NearbyUsers;
