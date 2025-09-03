"use client";

import React from "react";
import styles from "@/app/tecnico/Chamadas/[id]/page.module.css";
import HeaderTecnico from "@/components/HeaderTecnico/headerTecnico";
import CalendarPage from "@/components/Calendario/page";
import Relatorios from "@/components/Relatorios/relatorios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useRef } from "react";

export default function InfoPage({ params }) {
    const { id } = React.use(params);
    const [chamado, setChamado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [prazoSelecionado, setPrazoSelecionado] = useState(null);
    const [apontamentoTexto, setApontamentoTexto] = useState("");
    const [isEnviandoApontamento, setIsEnviandoApontamento] = useState(false);
    const [showExtensionForm, setShowExtensionForm] = useState(false);
    const router = useRouter();
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    // Estados para os dois modais
    const [showConfirmarModal, setShowConfirmarModal] = useState(false);
    const [showSolucaoModal, setShowSolucaoModal] = useState(false);

    const [solucaoTexto, setSolucaoTexto] = useState("");
    const [isFinalizando, setIsFinalizando] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);

  const [timelineItems, setTimelineItems] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const decoded = jwtDecode(token);
        setUsuarioLogado(decoded);

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
            
                if (data.prazo) {
                    const today = new Date();
                    today.setHours(0,0,0,0);

                    const prazoDate = new Date(data.prazo);
                    prazoDate.setHours(0,0,0,0);

                    const oneDayInMs = 24 * 60 * 60 * 1000;
                    const daysUntilPrazo = Math.round((prazoDate - today) / oneDayInMs);
                    
                    if (daysUntilPrazo <= 3 && daysUntilPrazo >= 0) {
                        setShowExtensionForm(true);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchChamado();
    }, [id, router]);

    const handleAssumirChamado = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        if (!prazoSelecionado) {
            alert("Por favor, selecione um prazo.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/chamados/assumir/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ prazo: prazoSelecionado }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.mensagem || 'Erro ao assumir chamado.');
            }
            alert("Chamado assumido com sucesso com o prazo estipulado!");
            router.push("/tecnico/dashboard");
        } catch (err) {
            console.error("Erro ao assumir chamado:", err.message);
            alert(err.message);
        }
    };

    const handleEstipularPrazo = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        if (!prazoSelecionado) {
            alert("Por favor, selecione um prazo.");
            return;
        }

        if (chamado.prazo) {
            alert("O prazo para este chamado já foi estipulado e não pode ser alterado.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/chamados/prazo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ prazo: prazoSelecionado }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.mensagem || 'Erro ao estipular prazo.');
            }
            alert("Prazo estipulado com sucesso!");
            setChamado(prevChamado => ({ ...prevChamado, prazo: prazoSelecionado }));
        } catch (err) {
            console.error("Erro ao estipular prazo:", err.message);
            alert(err.message);
        }
    };

    const handleEstenderPrazo = async () => {
        if (!prazoSelecionado) {
            alert("Por favor, selecione a nova data.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/chamados/prazo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ prazo: prazoSelecionado }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.mensagem || 'Erro ao estender prazo.');
            }

            alert("Prazo estendido com sucesso!");
            setChamado(prevChamado => ({ ...prevChamado, prazo: prazoSelecionado }));
            setShowExtensionForm(false);
            setPrazoSelecionado(null);
        } catch (err) {
            console.error("Erro ao estender prazo:", err.message);
            alert(err.message);
        }
    };

    const handleFinalizarClick = () => {
        setShowConfirmarModal(true);
    };

    const handleEnviarSolucao = async () => {
        if (solucaoTexto.trim() === "") {
            alert("Por favor, descreva a solução adotada.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        setIsFinalizando(true);

        try {
            const res = await fetch(`${API_URL}/chamados/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: 'concluido',
                    solucao: solucaoTexto
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.mensagem || 'Erro ao finalizar chamado');
            }
            router.push("/tecnico/dashboard");
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setIsFinalizando(false);
            setShowSolucaoModal(false);
        }
    };

    const handleCriarApontamento = async () => {
        if (apontamentoTexto.trim() === "") {
            alert("Por favor, preencha o conteúdo do apontamento.");
            return;
        }

        setIsEnviandoApontamento(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_URL}/chamados/${id}/apontamentos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    apontamento: apontamentoTexto,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.mensagem || 'Erro ao criar apontamento.');
            }

            alert("Apontamento criado com sucesso!");
            setApontamentoTexto("");
        } catch (err) {
            console.error("Erro ao criar apontamento:", err);
            alert(err.message);
        } finally {
            setIsEnviandoApontamento(false);
        }
    };

    const newData = dataInputRef.current.value;
    const newTitulo = tituloTextareaRef.current.value;

    if (newData && newTitulo) {
      const newTimelineItem = {
        titulo: newTitulo,
        data: newData,
      };

      setTimelineItems((prevItems) => [...prevItems, newTimelineItem]);

      dataInputRef.current.value = '';
      tituloTextareaRef.current.value = '';
    }
  };

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
  })
    const isChamadoPendente = chamado.status === 'pendente';
    const isChamadoAssumido = chamado.status === 'em andamento' && chamado.tecnico_id === usuarioLogado.id;

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
                            <Relatorios />
                            <div className={styles.botoes}>
                                <button className={styles.emProgresso}>Em Andamento</button>
                                <button
                                    className={styles.concluido}
                                    onClick={handleFinalizarClick}
                                    disabled={isFinalizando}
                                >
                                    {isFinalizando ? 'Finalizando...' : 'Finalizar'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {chamado.prazo && showExtensionForm && (
                        <div className={styles.warningPrazo}>
                            <p className={styles.warningText}>
                                ⚠️ Atenção: O prazo de resolução está se esgotando!
                            </p>
                            <button
                                className={styles.btnEstender}
                                onClick={() => setShowExtensionForm(true)}
                            >
                                Estender Prazo
                            </button>
                            {showExtensionForm && (
                                <div className={styles.formEstender}>
                                    <p>Selecione a nova data para o prazo:</p>
                                    <div className={styles.calendario}>
                                        <CalendarPage onDateSelect={setPrazoSelecionado} />
                                    </div>
                                    <button
                                        className={styles.btnConfirmarEstender}
                                        onClick={handleEstenderPrazo}
                                    >
                                        Confirmar Nova Data
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={styles.prazo}>
                        <h3 className={styles.titulo}>Prazo</h3>
                        <div className={styles.calendario}>
                            <CalendarPage 
                                onDateSelect={setPrazoSelecionado}
                                markedDate={chamado.prazo} 
                            />
                        </div>
                        {prazoSelecionado && isChamadoAssumido && !chamado.prazo && (
                            <div className={styles.confirmarPrazo}>
                                <p>Estipular prazo de resolução para **{prazoSelecionado}**?</p>
                                <button
                                    className={styles.btnConfirmar}
                                    onClick={handleEstipularPrazo}
                                >
                                    Confirmar
                                </button>
                            </div>
                        )}
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
                            {chamado.apontamentos && chamado.apontamentos.map((apontamento, index) => (
                                <div key={index} className={styles.informacoesLinhaTempo}>
                                    <span className={styles.ponto}></span>
                                    <div>
                                        <h4>{apontamento.apontamento}</h4> 
                                        <p className={styles.dataLinhaTempo}>{apontamento.criado_em}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {mostrarForm && (
                            <div className={styles.formTimeline}>
                                <label>Apontamento</label>
                                <input
                                    type="text"
                                    placeholder="Descreva brevemente o apontamento"
                                    value={apontamentoTexto}
                                    onChange={(e) => setApontamentoTexto(e.target.value)}
                                />
                                <button
                                    className={styles.btnEnviar}
                                    onClick={handleCriarApontamento}
                                    disabled={isEnviandoApontamento}
                                >
                                    {isEnviandoApontamento ? "Enviando..." : "Enviar"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Modal 1 - Confirmar finalização */}
            <div 
              className={`modal fade ${showConfirmarModal ? "show" : ""}`} 
              id="confirmarModal" 
              tabIndex="-1" 
              aria-labelledby="confirmarModalLabel" 
              aria-modal="true" 
              role="dialog" 
              style={{ display: showConfirmarModal ? "block" : "none" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="confirmarModalLabel">
                      Confirmar Finalização
                    </h1>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setShowConfirmarModal(false)} 
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    Tem certeza que deseja finalizar este chamado?
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setShowConfirmarModal(false)}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={() => {
                        setShowConfirmarModal(false);
                        setShowSolucaoModal(true);
                      }}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {showConfirmarModal && <div className="modal-backdrop fade show"></div>}

            {/* Modal 2 - Descrever solução */}
            <div 
              className={`modal fade ${showSolucaoModal ? "show" : ""}`} 
              id="solucaoModal" 
              tabIndex="-1" 
              aria-labelledby="solucaoModalLabel" 
              aria-modal="true" 
              role="dialog" 
              style={{ display: showSolucaoModal ? "block" : "none" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="solucaoModalLabel">
                      Descrever Solução
                    </h1>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setShowSolucaoModal(false)} 
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <textarea
                      className="form-control"
                      value={solucaoTexto}
                      onChange={(e) => setSolucaoTexto(e.target.value)}
                      placeholder="Ex: O problema foi resolvido com a substituição do teclado do computador..."
                      rows="5"
                    ></textarea>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setShowSolucaoModal(false);
                        setShowConfirmarModal(true);
                      }}
                      disabled={isFinalizando}
                    >
                      Voltar
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={handleEnviarSolucao}
                      disabled={isFinalizando}
                    >
                      {isFinalizando ? "Finalizando..." : "Confirmar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {showSolucaoModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
