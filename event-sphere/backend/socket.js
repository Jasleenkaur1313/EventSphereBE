const { Server } = require('socket.io');

let io;

function initSocket(server) {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    // Broadcast updated online user count to everyone
    io.emit('users:count', io.engine.clientsCount);

    // User is viewing events in a category — join that room
    socket.on('category:join', (category) => {
      if (socket._currentCategory) {
        socket.leave(`category:${socket._currentCategory}`);
      }
      socket._currentCategory = category;
      socket.join(`category:${category}`);

      const count = io.sockets.adapter.rooms.get(`category:${category}`)?.size || 0;
      io.to(`category:${category}`).emit('category:viewers', { category, count });
    });

    // User navigates away from category
    socket.on('category:leave', (category) => {
      socket.leave(`category:${category}`);
      socket._currentCategory = null;

      const count = io.sockets.adapter.rooms.get(`category:${category}`)?.size || 0;
      io.to(`category:${category}`).emit('category:viewers', { category, count });
    });

    socket.on('disconnect', () => {
      // Update viewer count for any category room they were in
      if (socket._currentCategory) {
        const cat = socket._currentCategory;
        const count = io.sockets.adapter.rooms.get(`category:${cat}`)?.size || 0;
        io.to(`category:${cat}`).emit('category:viewers', { category: cat, count });
      }
      io.emit('users:count', io.engine.clientsCount);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.IO not initialized — call initSocket(server) first');
  return io;
}

module.exports = { initSocket, getIO };
