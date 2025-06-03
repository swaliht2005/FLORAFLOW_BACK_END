
const authMiddleware = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (token === 'valid-token-123') { // Replace with real token validation (e.g., JWT)
    socket.user = { id: 'user1', username: 'exampleUser' };
    next();
  } else {
    next(new Error('Authentication error'));
  }
};

module.exports = { authMiddleware };
