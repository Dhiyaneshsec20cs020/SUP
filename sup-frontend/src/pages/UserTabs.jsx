import React, { useState } from 'react';
import NearbyUsers from './NearbyUsers';
import ConnectedUsers from './ConnectedUsers';
import PendingRequests from './PendingRequests'; // <-- Step 1
import { useNavigate } from 'react-router-dom';


function UserTabs() {
  const [activeTab, setActiveTab] = useState('nearby');
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem('token');
  navigate('/'); // redirect to login page
};

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => setActiveTab('nearby')}>Nearby Users</button>
        <button onClick={() => setActiveTab('connected')}>Connected Users</button>
        <button onClick={() => setActiveTab('pending')}>Pending Requests</button> {/* <-- Step 2 */}
      </div>
    <button onClick={handleLogout} style={{ marginLeft: 'auto', background: 'red', color: 'white' }}>
    Logout
  </button>
      <div style={{ marginTop: '2rem' }}>
        {activeTab === 'nearby' && <NearbyUsers />}
        {activeTab === 'connected' && <ConnectedUsers />}
        {activeTab === 'pending' && <PendingRequests />} {/* <-- Step 3 */}
      </div>
    </div>
  );
}

export default UserTabs;
