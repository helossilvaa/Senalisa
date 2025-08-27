// components/Relatorios/relatorios.jsx

import styles from "@/components/Relatorios/relatorios.module.css";
import Link from 'next/link';

export default function Relatorios({ relatorio, activeTab }) {
  if (!relatorio) {
    return null;
  }

  const getInfoByTab = () => {
    switch (activeTab) {
      case 0: // Chamados
        return {
          titulo: `Chamado #${relatorio.chamado?.id || 'N/A'}: ${relatorio.chamado?.titulo || "Sem título"}`,
          info: `Técnico: ${relatorio.tecnico?.nome || 'N/A'} - Equipamento: ${relatorio.equipamento?.nome || 'N/A'}`
        };
      case 1: // Técnicos
        return {
          titulo: `Técnico: ${relatorio.tecnico?.nome || 'N/A'}`,
          info: `Chamado #${relatorio.chamado?.id || 'N/A'} - Título: ${relatorio.chamado?.titulo || 'N/A'}`
        };
      case 2: // Objetos Quebrados
        return {
          titulo: `Equipamento: ${relatorio.equipamento?.nome || 'N/A'} (Patrimônio: ${relatorio.equipamento?.patrimonio || 'N/A'})`,
          info: `Chamado #${relatorio.chamado?.id || 'N/A'} - Técnico: ${relatorio.tecnico?.nome || 'N/A'}`
        };
      default:
        return {
          titulo: relatorio.chamado?.titulo || "Relatório sem título",
          info: relatorio.descricao
        };
    }
  };

  const displayInfo = getInfoByTab();

  return (
    <div className={styles.documentos}>
      <div className={styles.icon}>
        <i className="bi bi-file-earmark-richtext"></i>
      </div>
      <div className={styles.info}>
        <div className={styles.titulo}>
          <p>{displayInfo.titulo}</p>
        </div>
        <div className={styles.link}>
          <p>{displayInfo.info}</p>
        </div>
      </div>
      <div className={styles.download}>
        <Link href={`http://localhost:8080/relatorios/pdf`} target="_blank">
          <div className={styles.baixar}>
            <i className="bi bi-arrow-down-circle-fill" />
          </div>
        </Link>
      </div>
    </div>
  );
}