import { Server } from "socket.io";

let io;

export const initWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Usuário conectado ao WebSocket:", socket.id);

    socket.on("join_room", ({ chatId }) => {
      socket.join(`chat_${chatId}`);
      console.log(`Usuário entrou na sala chat_${chatId}`);
    });

    socket.on("message", (data) => {
      // Emite para todos na sala, exceto quem enviou
      io.to(`chat_${data.chat_id}`).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("Usuário desconectado:", socket.id);
    });
  });
};

export const getIO = () => io;
