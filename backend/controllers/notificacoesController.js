import { listarNotificacoesPorTecnico, listarNotificacoesPorUsuario, marcarComoVista} from '../models/notificacoes.js'; 

const listarNotificacoesPorTecnicoController = async (req, res) => {

    try {
        return notificacaoTecnico = await listarNotificacoesPorTecnico(id);
        res.json(notificacoes);

        
    } catch (error) {
        res.status(500).json({mensagem: 'Erro ao listar notificações por tecnico.'})
    }
}


const marcarComoVista


