import styles from "@/components/Relatorios/relatorios.module.css"

export default function Relatorios () {
    return(
        <div className={styles.documentos}>
            <div className={styles.icon}>
                <i className="bi bi-file-earmark-richtext"></i>
            </div>
            <div className={styles.info}>
                <div className={styles.titulo}><p>Mouse Quebrado</p></div>
                <div className={styles.link}><p>mouseQuebrado.pdf</p></div>  
            </div>
            <div className={styles.download}>
           <div className={styles.baixar}><i className="bi bi-arrow-down-circle-fill"/></div></div>
        </div>
    )
}