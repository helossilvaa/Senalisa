import styles from "@/app/tecnico/informacoes/page.module.css";
import HeaderTecnico from "@/components/HeaderTecnico/headerTecnico";

export default function Informacoes() {
    return (
        <div className={styles.page}>
            <div className={styles.sidebar}>
                <HeaderTecnico />
            </div>

            <div className={styles.detalhesPrincipais}>
                <div className={styles.informacoes}>
                    <h3 className={styles.secaoTitulo}>Informações</h3>
                    <div className={styles.card}>
                        <h2 className={styles.tituloCard}>Mouse quebrado</h2>
                        <div className={styles.subInfo}>
                            <p className={styles.autor}>Isabella Nunes</p>
                            <p className={styles.data}>14 de fevereiro</p>
                        </div>
                        <p className={styles.descricao}>The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.</p>
                        <div className={styles.botoes}>
                            <button className={styles.emProgresso}>Em Andamento</button>
                            <button className={styles.concluido}>Finalizado</button>
                        </div>
                    </div>
                </div>

                <div className={styles.prazo}>
                    <h3 className={styles.secaoTitulo}>Prazo</h3>
                    <div className={styles.calendario}>
                        <p>Aqui vai o calendário</p>
                    </div>
                </div>
            </div>
        </div>
    );
}