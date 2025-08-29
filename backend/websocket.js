import { Server } from 'socket.io';

const usuariosOnline = {};
let io; 

const initWebSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('🟢 Usuário conectado!', socket.id);

        socket.on('entrar_chat', (usuarioId) => {
            usuariosOnline[usuarioId] = socket.id;
            console.log(`Usuário ${usuarioId} entrou no chat.`);
        });
        
        connection.on('disconnect', () => {
            for (const id in usuariosOnline) {
                if (usuariosOnline[id] === socket.id) {
                    delete usuariosOnline[id];
                    console.log(`Usuário ${id} desconectado.`);
                    break;
                }
            }
        });
    });
};

const getOnlineUsers = () => {
    return usuariosOnline;
};


const emitirParaUsuario = (usuarioId, evento, data) => {
    const socketId = usuariosOnline[usuarioId];
    if (socketId) {
        
        io.to(socketId).emit(evento, data);
        console.log(`Notificação em tempo real enviada para o usuário ${usuarioId}`);
    }
};

export { initWebSocket, getOnlineUsers, emitirParaUsuario };