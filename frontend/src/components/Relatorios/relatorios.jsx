// components/Relatorios/relatorios.jsx

import styles from "@/components/Relatorios/relatorios.module.css";

export default function Relatorios({ relatorio, activeTab }) {
  if (!relatorio) {
    return null;
  }

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

      <a href={`http://localhost:8080/relatorios/chamados/pdf`} target="_blank"/>
        
          <div className={styles.baixar}>
            <i className="bi bi-arrow-down-circle-fill" />
          </div>
      </div>
    </div>
  );
}