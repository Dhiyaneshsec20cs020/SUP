import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

const socket = io('http://localhost:5000'); // or use env variable

function ChatWindow({ user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const currentUserId = decoded.id;

  // Join own socket room
  useEffect(() => {
    socket.emit('join', currentUserId);

    // Listen for new messages
    socket.on('privateMessage', (msg) => {
      const isRelevant =
        (msg.senderId === user.id && msg.receiverId === currentUserId) ||
        (msg.senderId === currentUserId && msg.receiverId === user.id);

      if (isRelevant) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off('privateMessage');
    };
  }, [user.id, currentUserId]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    const message = {
      senderId: currentUserId,
      receiverId: user.id,
      content: newMsg,
    };

    socket.emit('privateMessage', message); // real-time emit
    setNewMsg('');
  };

  useEffect(() => {
    fetchMessages();
  }, [user.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '2rem' }}>
      <h3>Chat with {user.username}</h3>
      <button onClick={onClose}>Close</button>

      <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: '0.5rem 0' }}>
            <strong>{msg.senderId === user.id ? user.username : 'You'}:</strong> {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message"
          style={{ width: '80%' }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
