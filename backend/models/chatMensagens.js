import {create, readAll, read } from '../config/database.js';

const criarMensagens = async (mensagemData) => {
  try {
    return await create('chatMensagens', mensagemData);
  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    throw error;
  }
};

const listarMensagens = async (chatId) => {
  try {
    return await readAll('chat_mensagens', `chat_id = ${chatId}`);
  } catch (error) {
    console.error('Erro ao listar mensagens: ', error);
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

export { criarMensagens, listarMensagens, obterMensagemPorId };