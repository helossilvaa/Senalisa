import { listarNotificacoesPorTecnico, listarNotificacoesPorUsuario, marcarComoVista} from '../models/notificacoes.js'; 

const listarNotificacoesController = async (req, res) => {
  try {

    const { id, funcao } = req.usuario;

    let notificacoes;

    if (funcao === 'usuario') {
      notificacoes = await listarNotificacoesPorUsuario(id);
    } else if (funcao === 'funcionario') {
      notificacoes = await listarNotificacoesPorTecnico(id);
    } else {
      return res.status(403).json({ mensagem: 'Função não autorizada para visualizar notificações.' });
    }

    return res.json(notificacoes);

  } catch (error) {
    console.error('Erro ao listar notificações:', error);
    return res.status(500).json({ mensagem: 'Erro interno ao listar notificações.' });
  }
};


const marcarComoVistaController = async (req, res) => {
    const { idNotificacao } = req.params;
    try {
        await marcarComoVista(idNotificacao);
        res.json({ mensagem: 'Notificação marcada como vista.' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao atualizar notificação.' });
    }
};

export { listarNotificacoesController, marcarComoVistaController };

