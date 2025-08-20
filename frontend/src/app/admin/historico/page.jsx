import styles from "@/app/admin/historico/historico.module.css";
import HeaderAdmin from "@/components/HeaderAdmin/headerAdmin";
import Card from "@/components/Card/Card";

export default function Informacoes() {
    return (
        <div className={styles.page}>
    <HeaderAdmin />
    
    <div className="container-fluid p-4">
        <div className={styles.tituloPrincipal}>
            <h1>Histórico</h1>
        </div>
    <div className={styles.conteudoPrincipal}>
        <div className={styles.chamados}>
            <button>Novos Chamados</button>
        </div>
        <div className={styles.chamados}>
            <button>Chamados Pendentes</button>
        </div>
        <div className={styles.chamados}>
            <button>Chamados Concluídos</button>
        </div>
    </div>
    <div className={styles.todos}>
       <h3>Chamados</h3>
    </div>
    </div>
           
</div>
    );
}