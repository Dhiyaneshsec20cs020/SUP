const express = require('express');
const http = require('http'); // required for socket.io
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');


dotenv.config();

// ✅ 1. Initialize express app first
const app = express();

// ✅ 2. Create HTTP server using app
const server = http.createServer(app);

// ✅ 3. Set up Socket.io server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// ✅ 4. Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ✅ 5. Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// ✅ 6. Socket.io event handlers
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("join", (userId) => {
    if (!userId) {
      console.log("⚠️ Received null userId in join()");
      return;
    }

    console.log("User", userId, "joined room:", userId);
    socket.join(userId);
  });

  socket.on("privateMessage", ({ senderId, receiverId, content }) => {
    console.log(`💬 ${senderId} ➡️ ${receiverId}: ${content}`);

    // Emit to receiver
    io.to(receiverId).emit("privateMessage", {
      senderId,
      receiverId,
      content
    });

    // Optionally emit to sender as well
    io.to(senderId).emit("privateMessage", {
      senderId,
      receiverId,
      content
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ✅ 7. Start server after DB sync
const PORT = process.env.PORT || 5000;
db.sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`✅ SUP backend running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to sync DB:', err);
});
