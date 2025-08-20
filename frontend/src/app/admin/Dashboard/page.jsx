import styles from "@/app/admin/Dashboard/page.module.css";
import Home from "@/components/HeaderAdmin/headerAdmin";

export default function DashboardAdmin() {
    return (
        <>
            <div className={styles.page}>
                <Home />
                <div className={styles.dashboardContainer}>
                    <h2 className={styles.welcome}>Olá, William!</h2>

                    <div className={styles.cardsContainer}>
                        <div className={styles.cardStatusChamados}>
                            <h3>Status de todos os chamados da rede:</h3>
                            <p className={styles.numeroChamados}>200 <span>(quantidade total de chamados)</span></p>
                            <div className={styles.barraProgresso}>
                                <div className={styles.progresso}></div>
                            </div>
                            <ul className={styles.legenda}>
                                <li><span className={styles.bolinhaAndamento}></span> Em andamento</li>
                                <li><span className={styles.bolinhaAberto}></span> Aberto</li>
                                <li><span className={styles.bolinhaFinalizado}></span> Finalizado</li>
                            </ul>
                        </div>

                        <div className={styles.cardRelatorios}>
                            <h3>Relatórios recentes</h3>
                        </div>

                        <div className={styles.cardLarge}>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}