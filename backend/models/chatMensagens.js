import { create, readAll, read } from '../config/database.js';

const criarMensagens = async (mensagemData) => {
  try {
    // Corrigido para usar a mesma tabela
    return await create('chat_mensagens', mensagemData);
  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    throw error;
  }
};

// models/chatMensagens.js
const listarMensagens = async (chatId) => {
  try {
    return await readAll(
      "chat_mensagens",
      "chat_id = ?",
      [chatId] // 🔹 garante que vai como array
    );
  } catch (error) {
    console.error("Erro ao listar mensagens (model):", error);
    throw error;
  }
};

const obterMensagemPorId = async (id) => {
  try {
    return await read('chat_mensagens', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao obter mensagem por ID: ', error);
    throw error;
  }
};

const obterParticipantesDoChat = async (id) => {
  try {
    const chat = await read('chats', `id = ${id}`);
    if (!chat) return null;
    return [chat.usuario_id, chat.tecnico_id];
  } catch (error) {
    console.error('Erro ao obter participantes do chat:', error);
    throw error;
  }
};

export {
  criarMensagens,
  listarMensagens,
  obterMensagemPorId,
  obterParticipantesDoChat,
};
