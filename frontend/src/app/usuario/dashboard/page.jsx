import styles from '@/app/usuario/dashboard/page.module.css';
import HeaderTecnico from '@/components/HeaderTecnico/headerTecnico';
import CalendarPage from '@/components/Calendario/page';

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
                </div>
              </div>
              <div className={styles.chamadoItem}>
                <div>
                  <h4>Iluminação ruim</h4>
                  <p>Sala</p>
                </div>
                <div>
                  <button className={styles.btnVerMais}>Ver mais</button>
                </div>
              </div>
              <div className={styles.chamadoItem}>
                <div>
                  <h4>Iluminação ruim</h4>
                  <p>Sala</p>
                </div>
                <div>
                  <button className={styles.btnVerMais}>Ver mais</button>
                </div>
              </div>
            </div>
            <div className={styles.cards}>
              <div className={styles.cardSmallBottom}>
                <h3>Calendário</h3>
                <CalendarPage />
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}