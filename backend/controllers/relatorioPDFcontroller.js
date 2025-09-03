import PDFDocument from 'pdfkit';
import { read } from '../config/database.js';
import path from 'path';
import fs from 'fs';

const gerarRelatorioPdfPorIdController = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.usuarioFuncao !== 'admin') {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }

    const relatorio = await read('relatorios', `id = ${id}`);
    if (!relatorio) {
      return res.status(404).json({ mensagem: 'Relatório não encontrado.' });
    }

    const chamado = await read('chamados', `id = ${relatorio.chamado_id}`);
    const tecnico = await read('usuarios', `id = ${relatorio.tecnico_id}`);

    const relatorioComDados = {
      ...relatorio,
      chamado,
      tecnico: tecnico ? { id: tecnico.id, nome: tecnico.nome, email: tecnico.email } : null
    };

    // 🔹 Função para formatar data e hora
    const formatarDataHora = (dataISO) => {
      if (!dataISO) return 'N/A';
      return new Date(dataISO).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

   const calcularDuracao = (inicio, fim) => {
    if (!inicio || !fim) return 'N/A';

    const duracaoEmSegundos = (new Date(fim).getTime() - new Date(inicio).getTime()) / 1000;

    const dias = Math.floor(duracaoEmSegundos / 86400); 
    const horas = Math.floor((duracaoEmSegundos % 86400) / 3600);
    const minutos = Math.floor((duracaoEmSegundos % 3600) / 60);

    let duracaoFormatada = '';
    if (dias > 0) duracaoFormatada += `${dias} dia${dias > 1 ? 's' : ''} `;
    if (horas > 0) duracaoFormatada += `${horas}h `;
    if (minutos > 0) duracaoFormatada += `${minutos}min`;

    if (!duracaoFormatada.trim()) duracaoFormatada = 'Menos de 1 min';
    return duracaoFormatada.trim();
};

    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    const nomeDoArquivo = `relatorio-chamado-${id}.pdf`;
    const caminhoDoArquivo = path.join('pdfs_gerados', nomeDoArquivo);

    if (!fs.existsSync('pdfs_gerados')) {
      fs.mkdirSync('pdfs_gerados');
    }

    doc.pipe(fs.createWriteStream(caminhoDoArquivo));

    // 🔹 Cabeçalho
    doc.font('Helvetica-Bold').fontSize(20).fillColor('black')
      .text(`Relatório do Chamado`, { align: 'center', underline: true });
    doc.moveDown(1);

    doc.font('Helvetica-Bold').fontSize(16).fillColor('black')
      .text(`${chamado?.titulo || 'Sem título'} - ${chamado?.id || ''}`, { align: 'center' });
    doc.moveDown(2);

    // 🔹 Técnico
    doc.font('Helvetica-Bold').fontSize(14).fillColor('black').text('Técnico Responsável');
    doc.moveDown(0.5);

    doc.font('Helvetica').fontSize(12).fillColor('black')
      .text(`Nome: ${tecnico?.nome || 'N/A'}`);
    doc.text(`Email: ${tecnico?.email || 'N/A'}`);
    doc.moveDown(1);
    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke('#AAAAAA');
    doc.moveDown(1);

    // 🔹 Chamado
    doc.font('Helvetica-Bold').fontSize(14).fillColor('black').text('Detalhes do Chamado');
    doc.moveDown(0.5);

    doc.font('Helvetica').fontSize(12).fillColor('black')
      .text(`Descrição do Problema:\n${chamado?.descricao || 'N/A'}`);
    doc.moveDown(1);
    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke('#AAAAAA');
    doc.moveDown(1);

    // 🔹 Solução
    doc.font('Helvetica-Bold').fontSize(14).fillColor('black').text('Solução Adotada');
    doc.moveDown(0.5);

    doc.font('Helvetica').fontSize(12).fillColor('black')
      .text(relatorio?.solucao || 'N/A', { align: 'justify' });
    doc.moveDown(1);
    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke('#AAAAAA');
    doc.moveDown(1);

    // 🔹 Tempo
    doc.font('Helvetica-Bold').fontSize(14).fillColor('black').text('Tempo de Atendimento');
    doc.moveDown(0.5);

    doc.font('Helvetica').fontSize(12).fillColor('black')
      .text(`Início: ${formatarDataHora(relatorio?.comeco)}`);
    doc.text(`Fim: ${formatarDataHora(relatorio?.fim)}`);
    doc.text(`Duração: ${calcularDuracao(relatorio?.comeco, relatorio?.fim)}`);

    doc.end();

    res.status(200).json({ mensagem: 'PDF gerado com sucesso!', arquivo: nomeDoArquivo });

  } catch (error) {
    console.error('Erro ao gerar PDF de relatório:', error);
    res.status(500).json({ mensagem: 'Erro ao gerar PDF de relatório' });
  }
};

export { gerarRelatorioPdfPorIdController };
