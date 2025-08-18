import styles from '@/app/tecnico/Dashboard/page.module.css';
import HeaderTecnico from '@/components/HeaderTecnico/headerTecnico';

export default function DashboardTecnico() {

    return (
        <>
            <div className={styles.page}>
                <HeaderTecnico />
                <div className={styles.dashboardContainer}>
                    <h2 className={styles.welcome}>Olá,!</h2>

                    <div className={styles.cardsContainer}>
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                        <div className={styles.cardLarge}></div>
                        <div className={styles.cardSmallBottom}></div>
                    </div>
                </div>
            </div>
        </>
    );
}