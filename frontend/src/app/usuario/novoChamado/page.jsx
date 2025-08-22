'use client';
import { useEffect, useState } from 'react';
import './novo.css';
import Header from '@/components/Header/header';
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

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
  const [equipamentosFiltrados, setEquipamentosFiltrados] = useState([]);
  const router = useRouter();


  const API_URL = 'http://localhost:8080';


  useEffect(() => {

    const token = localStorage.getItem("token");
    
        if (!token) {
          router.push("/login");
          return;
        }

        console.log(localStorage.getItem("token"))
    
        try {

          const decoded = jwtDecode(token);
    
          if (decoded.funcao !== 'usuario') {
            router.push('/');
            return;
          }
    
          if (decoded.exp < Date.now() / 1000) {
            localStorage.removeItem("token");
            alert('Seu Login Expirou.');
            router.push('/login');
            return;
          }
    
          const id = decoded.id;
    
          fetch(`${API_URL}/usuarios/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .catch(err => {
              console.error("Erro ao buscar usuário: ", err); 
            });
    
        } catch (error) {
          console.error("Token inválido:", error);
          localStorage.removeItem("token");
          router.push("/login");
        }


        fetch(`${API_URL}/salas`, { 
          headers: { Authorization: `Bearer ${token}` } 
        })
          .then(async r => {
            const data = await r.json();
            return data;
          })
          .then(data => setSalas(data))
          .catch(err => console.error("Erro /salas:", err));

          
          fetch(`${API_URL}/equipamentos`, { 
            headers: { Authorization: `Bearer ${token}` } 
          })
            .then(async r => {
              const data = await r.json();
              return data;
            })
            .then(data => setEquipamentos(data))
            .catch(err => console.error("Erro /equipamentos:", err));


            fetch(`${API_URL}/pools`, { 
              headers: { Authorization: `Bearer ${token}` } 
            })
              .then(async r => {
                const data = await r.json();
                return data;
              })
              .then(data => setPools(data))
              .catch(err => console.error("Erro /pools:", err));
        
         
      }, []);
    

      useEffect(() => {

        if (!salaId) { setEquipamentosFiltrados([]); return; }
    
        const filtrados = equipamentos
          .filter(eq => eq?.sala_id != null && eq?.patrimonio != null && eq.sala_id.toString() === salaId)
          .map(eq => {

            const temChamado = pools.some(
            c => c.equipamento_id?.toString() === eq.patrimonio?.toString() && c.status !== 'encerrado'
          );

            return { ...eq, temChamado };
          });
          
        setEquipamentosFiltrados(filtrados);
        setEquipamentoId(''); // resetar seleção ao mudar de sala
      }, [salaId, equipamentos, pools]);
    


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
          sala_id: salaId,
          equipamento_id: equipamentoId
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
                    <option key={eq.patrimonio} 
                    value={eq.patrimonio}
                    disabled={eq.temChamado}>
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
