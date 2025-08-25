import styles from "@/components/Relatorios/relatorios.module.css";

export default function Relatorios({ relatorio }) {
  return (
    <div className={styles.documentos}>
      <div className={styles.icon}>
        <i className="bi bi-file-earmark-richtext"></i>
      </div>
      <div className={styles.info}>
        <div className={styles.titulo}>
          <p>{relatorio.chamado?.titulo || "Sem título"}</p>
        </div>
        <div className={styles.link}>
          <p>{relatorio.descricao}</p>
        </div>
      </div>
      <div className={styles.download}>
        <a href={`http://localhost:3000/chamados/pdf`} target="_blank">
          <div className={styles.baixar}>
            <i className="bi bi-arrow-down-circle-fill" />
          </div>
        </a>
      </div>
    </div>
  );
}
