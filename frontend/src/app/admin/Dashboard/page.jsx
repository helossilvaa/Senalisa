"use client";
import { useEffect, useState } from "react";
import styles from "@/app/admin/Dashboard/page.module.css";
import HeaderAdmin from "@/components/HeaderAdmin/headerAdmin";
import Relatorios from "@/components/Relatorios/relatorios";
import CategoriasChamados from "@/components/Grafico/page";

export default function DashboardAdmin() {
    const [status, setStatus] = useState({ total: 0, emAndamento: 0, aberto: 0, finalizado: 0 });
    const [ranking, setRanking] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [allReports, setAllReports] = useState([]);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const fetchOptions = { credentials: 'include' };

                const resStatus = await fetch("http://localhost:8080/api/chamados/status-admin", fetchOptions);
                setStatus(await resStatus.json());

                const resRanking = await fetch("http://localhost:8080/api/chamados/ranking-tecnicos", fetchOptions);
                setRanking(await resRanking.json());

                const resCategorias = await fetch("http://localhost:8080/api/chamados/categorias", fetchOptions);
                setCategorias(await resCategorias.json());

                const resAllReports = await fetch("http://localhost:8080/api/chamados/reports", fetchOptions);
                const fetchedReports = await resAllReports.json();
                setAllReports(fetchedReports);

            } catch (error) {
                console.error("Erro ao buscar dados do dashboard:", error);
            }
        }
        fetchData();

        async function fetchUser() {
            try {
                // Corrigir a URL e adicionar a opção de credenciais
                const resUser = await fetch("http://localhost:8080/auth/check-auth", { credentials: 'include' });
                const userData = await resUser.json();

                if (resUser.ok && userData.authenticated && userData.user?.nome) {
                    setUserName(userData.user.nome);
                } else {
                    console.error("Falha ao autenticar ou obter nome de usuário:", userData);
                    setUserName("Visitante"); // Fallback
                }
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
                setUserName("Visitante"); // Fallback em caso de erro na requisição
            }
        }

        fetchData();
        fetchUser();

    }, []);


    const progressoAndamento = (status.emAndamento / status.total) * 100 || 0;
    const progressoAberto = (status.aberto / status.total) * 100 || 0;
    const progressoFinalizado = (status.finalizado / status.total) * 100 || 0;

    const recentReportsToDisplay = allReports
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);

    return (
        <div className={styles.page}>
            <HeaderAdmin />
            <div className={styles.dashboardContainer}>
                <h2 className={styles.welcome}>Olá, {userName || "visitante"}!</h2>

                <div className={styles.cardsContainer}>
                    <div className={styles.cardStatusChamados}>
                        <h3>Status de todos os chamados da rede:</h3>
                        <p className={styles.numeroChamados}>
                            {status.total}
                        </p>
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

                    <div className={styles.cardRelatorios}>
                        <h3>Relatórios recentes</h3>
                        {recentReportsToDisplay.length > 0 ? (
                            recentReportsToDisplay.map((report) => (
                                <Relatorios
                                    key={report.id || report.chamado?.id || Math.random()}
                                    relatorio={report}
                                />
                            ))
                        ) : (
                            <p>Nenhum relatório recente encontrado.</p>
                        )}
                    </div>

                    <div className={styles.cardLarge}>
                        <div className={styles.graficoTecnicos}>
                            <h4>Técnicos que mais resolvem chamados</h4>
                            {ranking.map((tec, i) => (
                                <div key={i} className={styles.tecnicoBar}>
                                    <span className={styles.nomeTecnico}>{tec.nome}</span>
                                    <div className={styles.preenchimento}
                                        style={{ width: `${tec.percentual}%` }}>
                                        {tec.percentual}%
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.estatistica}>
                            <h4>Categorias mais recorrentes de chamados</h4>
                            <div className={styles.graficoObjetos}>
                                <CategoriasChamados data={categorias} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}