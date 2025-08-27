import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRotas from './routes/authRotas.js';
import passport from './config/ldap.js';
import usuarioRotas from './routes/usuarioRotas.js';
import chamadoRotas from './routes/chamadoRotas.js';
import salasRotas from './routes/salasRotas.js';
import EquipamentoRotas from './routes/equipamento.js';
import PoolRotas from './routes/poolRotas.js';
import chatMensagensRotas from './routes/chatMensagensRotas.js';
import chatRotas from './routes/chatRotas.js';

// 1. Variáveis de ambiente
dotenv.config();

// 2. Express + middlewares
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: 'sJYMmuCB2Z187XneUuaOVYTVUlxEOb2K94tFZy370HjOY7T7aiCKvwhNQpQBYL9e',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// 3. Rotas REST normais
app.use('/auth', authRotas);
app.use('/usuarios', usuarioRotas);
app.use('/chamados', chamadoRotas);
app.use('/salas', salasRotas);
app.use('/equipamentos', EquipamentoRotas);
app.use('/pools', PoolRotas);
app.use('/chats', chatRotas);
app.use('/mensagem', chatMensagensRotas)

app.get('/health', (req, res) => res.json({ status: 'online' }));
app.get('/', (req, res) => res.send('Backend funcionando!'));

// 4. Cria servidor HTTP e socket.io
const PORT = process.env.PORT || 8080;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});

// 5. Eventos do chat em tempo real
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

// 6. Inicializa servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
