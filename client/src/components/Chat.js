import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Or your deployed backend URL

function Chat({ currentUserId, selectedFriendId }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (currentUserId) {
      socket.emit('join', currentUserId);

      socket.on('receiveMessage', (msg) => {
        if (msg.senderId === selectedFriendId || msg.receiverId === selectedFriendId) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [currentUserId, selectedFriendId]);

  const sendMessage = () => {
    const msg = {
      senderId: currentUserId,
      receiverId: selectedFriendId,
      message
    };
    socket.emit('sendMessage', msg);
    setMessages((prev) => [...prev, msg]);
    setMessage('');
  };

  return (
    <div>
      <h3>Chat with user #{selectedFriendId}</h3>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <p key={i}><strong>{m.senderId === currentUserId ? 'Me' : 'Them'}:</strong> {m.message}</p>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
