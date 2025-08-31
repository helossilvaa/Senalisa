"use client";

import * as React from "react";
import styles from "@/app/tecnico/Chamadas/[id]/page.module.css";
import HeaderTecnico from "@/components/HeaderTecnico/headerTecnico";
import CalendarPage from "@/components/Calendario/page";
import Relatorios from "@/components/Relatorios/relatorios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export default function InfoPage({ params }) {

    const { id } = React.use(params);
    const [chamado, setChamado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mostrarForm, setMostrarForm] = useState(false);
    const router = useRouter();
    const token = localStorage.getItem("token");

    const API_URL = "http://localhost:8080";

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
            localStorage.removeItem("token");
            alert("Seu login expirou.");
            router.push("/login");
            return;
        }

        const fetchChamado = async () => {
            try {
                const res = await fetch(`${API_URL}/chamados/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Erro ao buscar chamado");
                const data = await res.json();
                setChamado(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChamado();
    }, [id, router, token]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (!chamado) {
        return <p>Chamado não encontrado.</p>;
    }

    return (
        <div className={styles.page}>
            <HeaderTecnico />
            <div className="container-fluid p-4">
                <div className={styles.conteudoPrincipal}>
                    <div className={styles.infos}>
                        <h3 className={styles.titulo}>Informações</h3>
                        <div className={styles.card}>
                            <h2 className={styles.tituloCard}>{chamado.titulo}</h2>
                            <div className={styles.subInfo}>
                                <p className={styles.autor}>{chamado.usuario}</p>
                                <p className={styles.data}>{chamado.criado_em}</p>
                            </div>
                            <p className={styles.descricao}>
                                {chamado.descricao}
                            </p>
                            <Relatorios/>
                            <div className={styles.botoes}>
                                <button className={styles.emProgresso}>Em Andamento</button>
                                <button className={styles.concluido}>Finalizado</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.prazo}>
                        <h3 className={styles.titulo}>Prazo</h3>
                        <div className={styles.calendario}>
                            <CalendarPage />
                        </div>
                    </div>
                </div>

                <div className={styles.timelineContainer}>
                    <div className={styles.linhaTempo}>
                        <div className={styles.tituloLinhaTempo}>
                            <p>Acompanhe a resolução do problema</p>
                            <i
                                className="bi bi-plus-circle"
                                onClick={() => setMostrarForm(!mostrarForm)}
                            />
                        </div>

                        <div className={styles.infosLinhaTempo}>
                            {/* Static timeline content */}
                            <div className={styles.informacoesLinhaTempo}>
                                <span className={styles.ponto}></span>
                                <div>
                                    <h4>Materiais encomendados</h4>
                                    <p className={styles.dataLinhaTempo}>14 de fevereiro</p>
                                </div>
                            </div>
                            <div className={styles.informacoesLinhaTempo}>
                                <span className={styles.ponto}></span>
                                <div>
                                    <h4>Os materiais chegaram</h4>
                                    <p className={styles.dataLinhaTempo}>16 de fevereiro</p>
                                </div>
                            </div>
                            <div className={styles.informacoesLinhaTempo}>
                                <span className={styles.ponto}></span>
                                <div>
                                    <h4>Resolução em andamento</h4>
                                    <p className={styles.dataLinhaTempo}>17 de fevereiro</p>
                                </div>
                            </div>
                            <div className={styles.informacoesLinhaTempo}>
                                <span className={styles.ponto}></span>
                                <div>
                                    <h4>Problema resolvido</h4>
                                    <p className={styles.dataLinhaTempo}>18 de fevereiro</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {mostrarForm && (
                        <div className={styles.formTimeline}>
                            <label>Data</label>
                            <input type="text" placeholder="Digite a data" />
                            <label>Título</label>
                            <textarea placeholder="Digite o título"></textarea>
                            <button className={styles.btnEnviar}>Enviar</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}