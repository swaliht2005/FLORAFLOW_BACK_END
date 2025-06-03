
const Message = require('../model/Message');

const chatController = (io) => {
  return {
    handleConnection: (socket) => {
      console.log(`[${new Date().toISOString()}] User connected: ${socket.user.username}`);

      // Join room (e.g., for plant care group or notifications)
      socket.on('joinRoom', (room) => {
        socket.join(room);
        socket.emit('message', new Message('server', 'Server', `Welcome to ${room}!`));
        socket.to(room).emit('message', new Message('server', 'Server', `${socket.user.username} has joined ${room}`));
      });

      // Handle chat message or notification
      socket.on('chatMessage', ({ room, content }) => {
        const message = new Message(socket.id, socket.user.username, content);
        io.to(room).emit('message', message);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`[${new Date().toISOString()}] User disconnected: ${socket.user.username}`);
        io.emit('message', new Message('server', 'Server', `${socket.user.username} has left the chat`));
      });
    }
  };
};

module.exports = chatController;
