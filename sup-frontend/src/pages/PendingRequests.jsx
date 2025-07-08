import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PendingRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/requests', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch pending requests:', err);
    }
  };

  const respondToRequest = async (senderId, action) => {
    try {
        console.log('Sending request with:', {
  status: action === 'accept' ? 'accepted' : 'rejected'
});
await axios.put(`http://localhost:5000/api/users/requests/${senderId}`, 
  { status: action === 'accept' ? 'accepted' : 'rejected' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchRequests(); // refresh list
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Pending Connection Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {requests.map(({ id, Sender }) => (
            <li key={id}>
              {Sender?.username} ({Sender?.email})
              <button onClick={() => respondToRequest(id, 'accept')}>Accept</button>
              <button onClick={() => respondToRequest(id, 'reject')}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PendingRequests;
