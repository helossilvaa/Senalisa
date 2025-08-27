import { criarMensagens, listarMensagens, obterMensagemPorId, obterParticipantesDoChat} from "../models/chatMensagens.js";
import { criarNotificacao } from "../models/notificacoes.js";
import notificacaoTextos from "../utils/notificacoesTextos.js";
import { getOnlineUsers } from '../websocket.js';

const criarMensagemController = async (req, res) => {
    try {
        const { chat_id, mensagem } = req.body;
        const remetente_id = req.usuarioId;
        const remetenteNome = req.usuarioNome;

        await criarMensagens({ chat_id, remetente_id, mensagem });

        const participantes = await obterParticipantesDoChat(chat_id);
        const destinatario = participantes.find(id => id !== remetente_id);

        if (destinatario) {
            const usuariosOnline = getOnlineUsers();
            const destinatarioEstaOnline = !!usuariosOnline[destinatario];

            if (!destinatarioEstaOnline) {
                const notificacaoData = {
                    usuario_id: destinatario,
                    mensagem: notificacaoTextos.NOVA_MENSAGEM(remetenteNome),
                    visualizado: 'nao_vista',
                };
                await criarNotificacao(notificacaoData);
            }
        }
        res.status(201).json({ mensagem: 'Mensagem enviada com sucesso.' });
    } catch (error) {
        console.error('Erro ao criar mensagem de chat:', error);
        res.status(500).json({ mensagem: 'Erro interno ao enviar mensagem.' });
    }
};


const listarMensagensController = async (req, res) => {
    const { chatId } = req.params;

    try {
        const mensagens = await listarMensagens(chatId);
        res.status(200).json(mensagens);
    } catch (error) {
        console.error('Erro ao listar mensagens:', error);
        res.status(500).json({ error: 'Erro ao listar mensagens' });
    }
};

const obterMensagemPorIdController = async (req, res) => {
    const { id } = req.params;

    try {
        const mensagem = await obterMensagemPorId(id);
        if (!mensagem) {
            return res.status(404).json({ error: 'Mensagem não encontrada' });
        }
        res.status(200).json(mensagem);
    } catch (error) {
        console.error('Erro ao obter mensagem por ID:', error);
        res.status(500).json({ error: 'Erro ao obter mensagem' });
    }
};

export {criarMensagemController, listarMensagensController, obterMensagemPorIdController}