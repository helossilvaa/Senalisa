import styles from '@/app/tecnico/Dashboard/page.module.css';
import HeaderTecnico from '@/components/HeaderTecnico/headerTecnico';

export default function DashboardTecnico() {
    return (
        <>
            <div className={styles.page}>
                <HeaderTecnico />
                <div className={styles.dashboardContainer}>
                    <h2 className={styles.welcome}>Olá, William!</h2>

                    <div className={styles.cardsContainer}>
                        
                        <div className={styles.cardStatusChamados}>
                            <h3>Status dos seus chamados:</h3>
                            <p className={styles.numeroChamados}>90 <span>(quantidade total de chamados)</span></p>
                            <div className={styles.barraProgresso}>
                                <div className={styles.progresso}></div>
                            </div>
                            <ul className={styles.legenda}>
                                <li><span className={styles.bolinhaAndamento}></span> Em andamento</li>
                                <li><span className={styles.bolinhaAberto}></span> Aberto</li>
                                <li><span className={styles.bolinhaFinalizado}></span> Finalizado</li>
                            </ul>
                        </div>

                        <div className={styles.cardNotificacoes}>
                            <h3>Você tem</h3>
                            <p className={styles.numeroNotificacoes}>5</p>
                            <p className={styles.textoNotificacoes}>notificações novas</p>
                        </div>

                        <div className={styles.cardLarge}>
                            <h3>Chamados recentes</h3>
                            <div className={styles.chamadoItem}>
                                <div>
                                    <h4>Iluminação ruim</h4>
                                    <p>Sala</p>
                                </div>
                                <div>
                                    <button className={styles.btnVerMais}>Ver mais</button>
                                    <button className={styles.btnAceitar}>Aceitar</button>
                                </div>
                            </div>
                            <div className={styles.chamadoItem}>
                                <div>
                                    <h4>Iluminação ruim</h4>
                                    <p>Sala</p>
                                </div>
                                <div>
                                    <button className={styles.btnVerMais}>Ver mais</button>
                                    <button className={styles.btnAceitar}>Aceitar</button>
                                </div>
                            </div>
                            <div className={styles.chamadoItem}>
                                <div>
                                    <h4>Iluminação ruim</h4>
                                    <p>Sala</p>
                                </div>
                                <div>
                                    <button className={styles.btnVerMais}>Ver mais</button>
                                    <button className={styles.btnAceitar}>Aceitar</button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.cardSmallBottom}>
                            <h3>Lista de tarefas <span className={styles.add}>+</span></h3>
                            <ul className={styles.tarefas}>
                                <li><input type="checkbox"/> Pedir a compra de cabos;</li>
                                <li><input type="checkbox"/> Receber as peças do chamado da sala de DEV;</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}