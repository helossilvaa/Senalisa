import PDFDocument from 'pdfkit';
import { listarRelatorios } from '../models/relatorio.js';
import { read } from '../config/database.js';


export const gerarRelatoriosPdfController = async (req, res) => {
  try {
    if (req.user.funcao !== 'administrador') {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }

    const relatorios = await listarRelatorios();

    // Pega os dados completos de chamado, técnico e equipamento
    const relatoriosComDados = await Promise.all(
      relatorios.map(async (r) => {
        const chamado = await read('chamados', `id = ${r.chamado_id}`);
        const tecnico = await read('usuarios', `id = ${r.tecnico_id}`);
        const equipamento = chamado?.equipamento_id ? await read('equipamentos', `id = ${chamado.equipamento_id}`) : null;

        return {
          ...r,
          chamado,
          tecnico: tecnico ? { id: tecnico.id, nome: tecnico.nome, email: tecnico.email } : null,
          equipamento: equipamento || null,
        };
      })
    );

    // Cria o documento PDF
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    // Configura o cabeçalho da resposta HTTP para download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorios.pdf');

    // Envia o PDF diretamente para a resposta
    doc.pipe(res);

    // Título
    doc.fontSize(18).text('Relatórios de Chamados', { align: 'center' });
    doc.moveDown();

    relatoriosComDados.forEach((r, index) => {
      doc.fontSize(12).text(`Relatório #${r.id}`, { underline: true });
      doc.text(`Chamado: ${r.chamado?.titulo || 'N/A'}`);
      doc.text(`Técnico: ${r.tecnico?.nome || 'N/A'} (${r.tecnico?.email || ''})`);
      doc.text(`Equipamento: ${r.equipamento?.equipamento || 'N/A'}`);
      doc.text(`Descrição: ${r.descricao}`);
      doc.text(`Início: ${r.comeco}`);
      doc.text(`Fim: ${r.fim}`);
      doc.text(`Duração (segundos): ${r.duracao}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('Erro ao gerar PDF de relatórios:', error);
    res.status(500).json({ mensagem: 'Erro ao gerar PDF de relatórios' });
  }
};