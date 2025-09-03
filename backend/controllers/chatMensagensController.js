import {
  criarMensagens,
  listarMensagens,
  obterMensagemPorId,
} from "../models/chatMensagens.js";

// Criar mensagem
export const criarMensagemController = async (req, res) => {
  try {
    const { chat_id, remetente_id, mensagem } = req.body;

    if (!chat_id || !remetente_id || !mensagem) {
      return res.status(400).json({ error: "Dados insuficientes para criar mensagem" });
    }

    const mensagemData = {
      chat_id,
      remetente_id,
      mensagem,
    };

    const novaMensagem = await criarMensagens(mensagemData);
    res.status(201).json(novaMensagem);
  } catch (error) {
    console.error("Erro ao criar mensagem:", error);
    res.status(500).json({ error: "Erro ao criar mensagem" });
  }
};

// controllers/chatMensagensController.js
export const listarMensagensController = async (req, res) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      return res.status(400).json({ error: "ID do chat não fornecido" });
    }

    const mensagens = await listarMensagens(Number(chatId)); // 🔹 converte para número
    res.status(200).json(mensagens);
  } catch (error) {
    console.error("Erro ao listar mensagens:", error);
    res.status(500).json({ error: "Erro ao listar mensagens" });
  }
};


// Obter uma mensagem específica pelo ID
export const obterMensagemPorIdController = async (req, res) => {
  try {
    const { id } = req.params; // ✅ bate com /:id
    if (!id) {
      return res.status(400).json({ error: "ID da mensagem não fornecido" });
    }

    const mensagem = await obterMensagemPorId(id);
    if (!mensagem) {
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }

    res.status(200).json(mensagem);
  } catch (error) {
    console.error("Erro ao obter mensagem por ID:", error);
    res.status(500).json({ error: "Erro ao obter mensagem" });
  }
};
