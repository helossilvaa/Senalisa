import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';

const PORT = process.env.PORT || 3001;

// Cria servidor HTTP baseado no app.js
const server = createServer(app);

// Configura Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});

// Eventos de socket
io.on('connection', (socket) => {
  console.log('🟢 Usuário conectado!', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Usuário desconectado!', socket.id);
  });

  socket.on('set_username', (username) => {
    socket.data.username = username;
    socket.emit('user_info', { author: username });
  });

  socket.on('message', (text) => {
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username
    });
  });
});

// Sobe servidor
server.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}...`);
});
