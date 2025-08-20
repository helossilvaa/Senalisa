"use client";
import { useState } from "react";
import * as React from "react";
import styles from "@/app/tecnico/Chamadas/[id]/page.module.css";
import HeaderTecnico from "@/components/HeaderTecnico/headerTecnico";
import CalendarPage from "@/components/Calendario/page";

const infoChamadas = [
  {
    id: 1,
    titulo: 'Mouse Quebrado na sala de DEV',
    autor: 'Isabella Nunes',
    data: '14 de Fevereiro',
    descricao: 'The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.',
  },
  {
    id: 2,
    titulo: 'Mouse Quebrado',
    autor: 'Isabella Nunes',
    data: '14 de Fevereiro',
    descricao: 'The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.',
  },
  {
    id: 3,
    titulo: 'Mouse Quebrado na sala de DEV',
    autor: 'Isabella Nunes',
    data: '14 de Fevereiro',
    descricao: 'The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.',
  },
  {
    id: 4,
    titulo: 'Mouse Quebrado',
    autor: 'Isabella Nunes',
    data: '14 de Fevereiro',
    descricao: 'The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.',
  },
  {
    id: 5,
    titulo: 'Mouse Quebrado',
    autor: 'Isabella Nunes',
    data: '14 de Fevereiro',
    descricao: 'The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.',
  },
  {
    id: 6,
    titulo: 'Mouse Quebrado',
    autor: 'Isabella Nunes',
    data: '14 de Fevereiro',
    descricao: 'The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.',
  }
]

export default function InfoPage({ params }) {
  const { id } = React.use(params);
  const chamada = infoChamadas.find((s) => s.id === parseInt(id));
  const [mostrarForm, setMostrarForm] = useState(false);

  if (!chamada) {
    return <div>Sala não encontrada</div>;
  }

  return (
    <div className={styles.page}>
      <HeaderTecnico />
      <div className="container-fluid p-4">
        <div className={styles.conteudoPrincipal}>
          <div className={styles.infos}>
            <h3 className={styles.titulo}>Informações</h3>
            <div className={styles.card}>
              <h2 className={styles.tituloCard}>Mouse quebrado</h2>
              <div className={styles.subInfo}>
                <p className={styles.autor}>Isabella Nunes</p>
                <p className={styles.data}>14 de fevereiro</p>
              </div>
              <p className={styles.descricao}>
                The wise man therefore always holds in these matters to this
                principle of selection: he rejects pleasures to secure other
                greater pleasures, or else he endures pains to avoid worse pains.
              </p>
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
