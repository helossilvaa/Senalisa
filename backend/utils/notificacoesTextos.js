
const notificacaoTextos = {
    // Mensagens para Chamados
    CHAMADO_EM_ANDAMENTO: (id) => `O chamado ${id} agora está em andamento.`,
    CHAMADO_CONCLUIDO: (id) => `O chamado ${id} foi concluído. Por favor, deixe uma avaliação!`,
  
    // Mensagens de Boas-Vindas
    BEM_VINDO: (nome) => `Bem-vindo(a), ${nome}! Estamos felizes em ter você aqui.`,
  
    // Mensagens de Chat
    NOVA_MENSAGEM: (remetente) => `Você recebeu uma nova mensagem de ${remetente}!`,
  
    //Das avalições
    AVALIACAO_RECEBIDA: (id) => `Sua avaliação do chamado ${id} foi recebida com sucesso.`,
  };
  
  export default notificacaoTextos;