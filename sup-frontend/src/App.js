// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
//import Chat from './pages/Chat';
import NearbyUsers from './pages/NearbyUsers';
import UserTabs from './pages/UserTabs';
import PendingRequests from './pages/PendingRequests';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import ChatWindow from './components/ChatWindow';
import ChatWindow from './pages/ChatWindow';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/nearby" element={<NearbyUsers />} />
        <Route path="/users" element={<UserTabs />} />
        <Route path="/requests" element={<PendingRequests />} />
        <Route path="/chat/:userId" element={<ChatWindow />} />
      </Routes>
    </Router>
  );
}

export default App;
