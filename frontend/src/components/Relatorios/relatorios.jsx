import styles from "@/components/Relatorios/relatorios.module.css" 

// Recebe o objeto `relatorio` como prop
export default function Relatorios ({ relatorio }) { 
    if (!relatorio) return null; // Prevenção de erro caso o relatório seja nulo

    const duracaoEmSegundos = (new Date(relatorio.fim).getTime() - new Date(relatorio.comeco).getTime()) / 1000;
    const duracaoFormatada = `${Math.floor(duracaoEmSegundos / 60)} min e ${Math.floor(duracaoEmSegundos % 60)} seg`;

    return( 
        <div className={styles.documentos}> 
            <div className={styles.icon}> 
                <i className="bi bi-file-earmark-richtext"></i> 
            </div> 
            <div className={styles.info}> 
                {/* Exibe os dados do chamado */}
                <div className={styles.titulo}>
                    <p>{relatorio.chamado?.titulo || 'Chamado não encontrado'}</p>
                </div> 
                <div className={styles.link}>
                    <p>Resolvido por: {relatorio.tecnico?.nome || 'N/A'}</p>
                    <p>Duração: {duracaoFormatada}</p>
                </div>   
            </div> 
            <div className={styles.download}> 
                {/* O botão de download vai ser um clique que chama a função de download do PDF */}
                <div className={styles.baixar}>
                    <i className="bi bi-arrow-down-circle-fill"/>
                </div>
            </div> 
        </div> 
    ) 
}