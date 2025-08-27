import { criarNotificacao, deletarNotificacao, listarNotificacoesPorTecnico, listarNotificacoesPorUsuario, marcarComoVista} from '../models/notificacoes.js'; 


const criarNotificacaoController = async (req, res) => {
  try {
    const {
      mensagem
    } = req.body;

    notificacoesData = {
      usuario_id: req.usuarioId,
      mensagem,
      visualizado: 'nao_vista'
    };

    const notificacao = await criarNotificacao(notificacoesData);
    res.status(201).json({mensagem: 'Notificacao criada com sucesso!', notificacao})


  } catch (error) {
    console.error('Erro ao criar notificacao: ', error);
    return res.status(500).json({mensagem: 'Erro ao criar notificação.' })
  }
};


const listarNotificacoesController = async (req, res) => {
  try {

    const { id, funcao } = req.usuarioId;

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

const deletarNotificacaoController = async (req, res) => {

  const { idNotificacao } = req.params;

  try {
   await deletarNotificacao(idNotificacao);
  } catch (error) {
    res.status(500).json({mensagem: 'Erro ao deletar notificação.'})
  }
}

export { listarNotificacoesController, marcarComoVistaController, criarNotificacaoController, deletarNotificacaoController };

//quais seriam as rotas de notificacoes e como implementa-las, ja q eu quero q de notificacoes de qnd mudar status do chamado para em andamento e concluido, de deixar uma avaliação, qnd entrar pela 1 vez (mensagem de bem vindo), qnd um tecnico estiver falando com a pessoa no chat tipo "juliano te enviou uma mensagem" se o chat n estiver aberto