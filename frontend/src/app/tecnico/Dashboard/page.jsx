"use client";
import { useEffect, useState } from "react";
import styles from '@/app/tecnico/Dashboard/page.module.css';
import HeaderTecnico from '@/components/HeaderTecnico/headerTecnico';
import CardDashboardTecnico from "@/components/CardDashboardTecnico/page";
import ListaTarefa from "@/components/ListaTarefa/ListaTarefa";

export default function DashboardTecnico() {
    const [status, setStatus] = useState({ total: 0, emAndamento: 0, aberto: 0, finalizado: 0 });
    const [userName, setUserName] = useState("");
    const [chamadas, setChamadas] = useState([]);
    const [notificacoes, setNotificacoes] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const tecnicoId = "ID_DO_TECNICO";
            const res = await fetch(`http://localhost:3000/api/chamados/status/${tecnicoId}`);

            const data = await res.json();
            setStatus(data);
        }
        fetchData();

        async function fetchUser() {
            try {
                const resUser = await fetch("http://localhost:3000/api/auth/user");
                const userData = await resUser.json();
                setUserName(userData.nome);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            }
        }
        fetchUser();

        async function fetchChamados() {
            try {

                const resChamados = await fetch("http://localhost:3000/api/chamados/gerais", {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                const data = await resChamados.json();
                setChamadas(data);
            } catch (error) {
                console.error("Erro ao buscar chamados:", error);
            }
        }
        fetchChamados();

        async function fetchNotificacoes() {
            try {
                const res = await fetch("http://localhost:3000/api/notificacoes", {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                const data = await res.json();
                const novas = data.filter((n) => !n.lida);
                setNotificacoes(novas);
            } catch (error) {
                console.error("Erro ao buscar notificações:", error);
            }
        }
        fetchNotificacoes();

    }, []);

    const progressoAndamento = (status.emAndamento / status.total) * 100 || 0;
    const progressoAberto = (status.aberto / status.total) * 100 || 0;
    const progressoFinalizado = (status.finalizado / status.total) * 100 || 0;

    return (
        <div className={styles.page}>
            <HeaderTecnico />
            <div className={styles.dashboardContainer}>
                <h2 className={styles.welcome}>Olá, {userName || "visitante"}!</h2>

                <div className={styles.cardsContainer}>
                    <div className={styles.cardStatusChamados}>
                        <h3>Status dos seus chamados:</h3>
                        <p className={styles.numeroChamados}>{status.total}</p>
                        <div className={styles.barraProgresso}>
                            <div className={styles.progresso}
                                style={{ width: `${progressoAndamento}%`, background: "#8B0000" }} />
                            <div className={styles.progresso}
                                style={{ width: `${progressoAberto}%`, background: "#FF0000" }} />
                            <div className={styles.progresso}
                                style={{ width: `${progressoFinalizado}%`, background: "#BEBEBE" }} />
                        </div>
                        <ul className={styles.legenda}>
                            <li><span className={styles.bolinhaAndamento}></span> Em andamento</li>
                            <li><span className={styles.bolinhaAberto}></span> Aberto</li>
                            <li><span className={styles.bolinhaFinalizado}></span> Finalizado</li>
                        </ul>
                    </div>

                    <div className={styles.cardNotificacoes}>
                        <h3>Você tem</h3>
                        <p className={styles.numeroNotificacoes}>{notificacoes.length}</p>
                        <p className={styles.textoNotificacoes}>notificações novas</p>
                    </div>

                    <div className={styles.cardLarge}>
                        <h3>Chamados recentes</h3>
                        <div className={styles.chamadoItem}>
                            {chamadas.slice(0, 3).map((chamado) => (
                                <CardDashboardTecnico key={chamado.id} chamado={chamado} />
                            ))}
                        </div>
                    </div>

                    <div className={styles.cardSmallBottom}>
                        <ListaTarefa/>
                    </div>
                </div>
            </div>
        </div>
    );
}
