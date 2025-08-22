import styles from "@/app/admin/Dashboard/page.module.css";
import HeaderAdmin from "@/components/HeaderAdmin/headerAdmin";
import Relatorios from "@/components/Relatorios/relatorios";
import CategoriasChamados from "@/components/Grafico/page";

export default function DashboardAdmin() {
    return (
        <>
            <div className={styles.page}>
                <HeaderAdmin/>
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
                            <Relatorios/>
                        </div>

                        <div className={styles.cardLarge}>
                            <div className={styles.graficoTecnicos}>
                                <h4>Técnicos que mais resolvem chamados</h4>

                                <div className={styles.tecnicoBar}>
                                    <span className={styles.nomeTecnico}>Nome</span>
                                        <div className={styles.preenchimento} style={{width: "40%"}}>40%</div>
                                </div>

                                <div className={styles.tecnicoBar}>
                                    <span className={styles.nomeTecnico}>Nome</span>
                                        <div className={styles.preenchimento} style={{width: "38%"}}>38%</div>
                                </div>

                                <div className={styles.tecnicoBar}>
                                    <span className={styles.nomeTecnico}>Nome</span>
                                        <div className={styles.preenchimento} style={{width: "37%"}}>37%</div>
                                </div>
                            </div>

                            <div className={styles.estatistica}>
                                <h4>Categorias mais recorrentes de chamados</h4>
                                <div className={styles.graficoObjetos}>
<CategoriasChamados/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
