'use client';
import { useEffect, useState } from 'react';
import './novo.css';
import Header from '@/components/Header/header';

export default function Chamados() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipoId, setTipoId] = useState('');
  const [salaId, setSalaId] = useState('');
  const [equipamentoId, setEquipamentoId] = useState('');
  const [salas, setSalas] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [pools, setPools] = useState([]);
  const [chamadoCriado, setChamadoCriado] = useState(null);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:8080';

  // Busca salas, equipamentos e pools do backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    Promise.all([
      fetch(`${API_URL}/salas`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_URL}/equipamentos`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_URL}/pool`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ])
      .then(([salasData, equipamentosData, poolsData]) => {
        setSalas(salasData);
        setEquipamentos(equipamentosData);
        setPools(poolsData);
      })
      .catch(err => console.error(err));
  }, []);

  // Filtra equipamentos da sala selecionada
  const equipamentosFiltrados = equipamentos.filter(
    eq => eq.sala_id.toString() === salaId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setChamadoCriado(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Você precisa estar logado.');
        return;
      }

      const res = await fetch(`${API_URL}/chamados`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo,
          descricao,
          tipo_id: tipoId,
          patrimonio: equipamentoId,
          sala_id: salaId
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao criar chamado');
      }

      const data = await res.json();
      setChamadoCriado(data.id);
      setTitulo('');
      setDescricao('');
      setTipoId('');
      setSalaId('');
      setEquipamentoId('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex">
      <Header />
      <div className="container">
        <div className="container space-2">
          <h2 className="fw-bold">Novo chamado</h2>
          <form className="js-validate" onSubmit={handleSubmit}>
            <div className="row">

              {/* Título */}
              <div className="col-sm-6 mb-4">
                <label className="input-label">Título</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Título do chamado"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>

              {/* Tipo de assistência */}
              <div className="col-sm-6 mb-4">
                <label className="input-label">Tipo de assistência</label>
                <select
                  className="form-select"
                  value={tipoId}
                  onChange={(e) => setTipoId(e.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  {pools.map(p => (
                    <option key={p.id} value={p.id}>{p.titulo}</option>
                  ))}
                </select>
              </div>

              {/* Sala */}
              <div className="col-sm-6 mb-4">
                <label className="input-label">Sala</label>
                <select
                  className="form-select"
                  value={salaId}
                  onChange={(e) => setSalaId(e.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  {salas.map(s => (
                    <option key={s.id} value={s.id}>{s.nome_sala}</option>
                  ))}
                </select>
              </div>

              {/* Equipamento */}
              <div className="col-sm-6 mb-4">
                <label className="input-label">Equipamento</label>
                <select
                  className="form-select"
                  value={equipamentoId}
                  onChange={(e) => setEquipamentoId(e.target.value)}
                  required
                  disabled={!salaId} // desabilita se nenhuma sala estiver selecionada
                >
                  <option value="">Selecione</option>
                  {equipamentosFiltrados.map(eq => (
                    <option key={eq.patrimonio} value={eq.patrimonio}>
                      {eq.equipamento} (Patrimônio {eq.patrimonio})
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Descrição */}
            <div className="js-form-message mb-6">
              <label className="input-label">Descrição</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Descreva aqui o problema"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-danger">{error}</p>}
            {chamadoCriado && <p className="text-success">Chamado criado com sucesso! ID: {chamadoCriado}</p>}

            <button type="submit" className="btn btn-wide mb-4">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
