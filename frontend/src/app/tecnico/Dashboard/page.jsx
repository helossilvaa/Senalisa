"use client";
import styles from '@/app/tecnico/Dashboard/page.module.css';
import HeaderTecnico from '@/components/HeaderTecnico/headerTecnico';
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardTecnico() {
  const [chamados, setChamados] = useState([]);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [showInput, setShowInput] = useState(false);

  const router = useRouter();
  const API_URL = "http://localhost:8080";

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Buscar chamados e usuário
  useEffect(() => {
    const fetchChamados = async () => {
      if (!token) { router.push("/login"); return; }

      try {
        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
          localStorage.removeItem("token");
          alert("Seu login expirou.");
          router.push("/login");
          return;
        }

        const id = decoded.id;
        const resUser = await fetch(`${API_URL}/usuarios/${id}`, config);
        const dataUser = await resUser.json();
        setNomeUsuario(dataUser?.nome || 'Usuário não encontrado');

        const resChamados = await fetch(`${API_URL}/chamados/pendentes`, config);
        const dataChamados = await resChamados.json();
        setChamados(dataChamados);

        const resTarefas = await fetch(`${API_URL}/tarefas`, config);
        const dataTarefas = await resTarefas.json();
        setTarefas(dataTarefas);

      } catch (err) { console.error(err); }
    };
    fetchChamados();
  }, [router]);

  // Aceitar chamado
  const aceitarChamado = async (idChamado) => {
    try {
      const res = await fetch(`${API_URL}/chamados/assumirChamado/${idChamado}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao assumir chamado");
      setChamados(prev => prev.filter(c => c.id !== idChamado));
    } catch (err) { console.error(err); }
  };

  // Adicionar nova tarefa
  const adicionarTarefa = async () => {
    if (!novaTarefa.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/tarefas`, { descricao: novaTarefa }, config);
      setTarefas(prev => [res.data, ...prev]);
      setNovaTarefa('');
      setShowInput(false);
    } catch (err) { console.error(err); }
  };

  // Deletar tarefa
  const deletarTarefa = async (id) => {
    try {
      await axios.delete(`${API_URL}/tarefas/${id}`, config);
      setTarefas(prev => prev.filter(t => t.id !== id));
    } catch (err) { console.error(err); }
  };

  // Marcar tarefa concluída
  const toggleConcluida = async (id, concluida) => {
    try {
      await axios.put(`${API_URL}/tarefas/${id}`, { concluida: !concluida }, config);
      setTarefas(prev => prev.map(t => t.id === id ? { ...t, concluida: !concluida } : t));
    } catch (err) { console.error(err); }
  };

  const totalChamados = chamados.length;
  const statusCounts = {
    'pendente': chamados.filter(c => c.status === "pendente").length,
    'em andamento': chamados.filter(c => c.status === "em andamento").length,
    'concluido': chamados.filter(c => c.status === "concluido").length,
  };

  return (
    <div className={styles.page}>
      <HeaderTecnico />
      <div className={styles.dashboardContainer}>
        <h2 className={styles.welcome}>Olá, {nomeUsuario}!</h2>

        <div className={styles.cardsContainer}>
          {/* Status dos chamados */}
          <div className={styles.cardStatusChamados}>
            <h3>Status dos seus chamados:</h3>
            <p className={styles.numeroChamados}>
              {totalChamados} <span>(quantidade total de chamados)</span>
            </p>

            <div className={styles.barraProgresso}>
              {totalChamados > 0 && statusCounts['pendente'] > 0 && (
                <div
                  className={styles.progressoAberto}
                  style={{ width: `${(statusCounts['pendente'] / totalChamados) * 100}%` }}
                />
              )}
              {totalChamados > 0 && statusCounts['em andamento'] > 0 && (
                <div
                  className={styles.progressoEmAndamento}
                  style={{ width: `${(statusCounts['em andamento'] / totalChamados) * 100}%` }}
                />
              )}
              {totalChamados > 0 && statusCounts['concluido'] > 0 && (
                <div
                  className={styles.progressoFinalizado}
                  style={{ width: `${(statusCounts['concluido'] / totalChamados) * 100}%` }}
                />
              )}
            </div>

            <ul className={styles.legenda}>
              <li><span className={styles.bolinhaAndamento}></span> Em andamento ({statusCounts['em andamento']})</li>
              <li><span className={styles.bolinhaAberto}></span> Aberto ({statusCounts['pendente']})</li>
              <li><span className={styles.bolinhaFinalizado}></span> Finalizado ({statusCounts['concluido']})</li>
            </ul>
          </div>

          {/* Notificações */}
          <div className={styles.cardNotificacoes}>
            <h3>Você tem</h3>
            <p className={styles.numeroNotificacoes}>5</p>
            <p className={styles.textoNotificacoes}>notificações novas</p>
          </div>

          {/* Chamados recentes */}
          <div className={styles.cardLarge}>
            <h3>Chamados recentes</h3>
            {chamados.length === 0 ? <p>Nenhum chamado disponível</p> :
              chamados.slice(-3).reverse().map(c => (
                <div key={c.id} className={styles.chamadoItem}>
                  <div>
                    <h4>{c.titulo}</h4>
                    <p>{`Sala ${c.sala_id}`}</p>
                  </div>
                  <div>
                    <button className={styles.btnVerMais}>Ver mais</button>
                    <button className={styles.btnAceitar} onClick={() => aceitarChamado(c.id)}>Aceitar</button>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Lista de tarefas */}
          <div className={styles.cardSmallBottom}>
            <h3>
              Lista de tarefas
              <span className={styles.add} onClick={() => setShowInput(prev => !prev)}>+</span>
            </h3>

            {showInput && (
              <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={novaTarefa}
                  onChange={(e) => setNovaTarefa(e.target.value)}
                  placeholder="Nova tarefa"
                  style={{ flex: 1, padding: '5px' }}
                />
                <button onClick={adicionarTarefa}>Adicionar</button>
              </div>
            )}

            <ul className={styles.tarefas}>
              {tarefas.map(t => (
                <li key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={t.concluida}
                      onChange={() => toggleConcluida(t.id, t.concluida)}
                    /> {t.descricao}
                  </label>
                  <button onClick={() => deletarTarefa(t.id)} style={{ marginLeft: '10px' }}>🗑️</button>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
