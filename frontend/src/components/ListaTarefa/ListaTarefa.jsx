"use client"; 
import { useState, useEffect } from "react";
import styles from "./ListaTarefa.module.css";

export default function ListaTarefa() {
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    const salvas = JSON.parse(localStorage.getItem("tarefas")) || [];
    setTarefas(salvas);
  }, []);

  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  const addTarefa = (e) => {
    e.preventDefault();
    const input = e.target[0];
    if (input.value.trim().length > 0) {
      setTarefas([
        ...tarefas,
        { id: Date.now(), nome: input.value, check: false },
      ]);
      input.value = "";
    }
  };

  const toggleCheck = (id) => {
    setTarefas(
      tarefas.map((t) =>
        t.id === id ? { ...t, check: !t.check } : t
      )
    );
  };

  const deletar = (id) => {
    setTarefas(tarefas.filter((t) => t.id !== id));
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.h3}>
        Lista de tarefas
      </h3>

      <form className={styles.form} onSubmit={addTarefa}>
        <input type="text" placeholder="Adicione sua tarefa" />
        <button>Adicionar</button>
      </form>

      <ul>
        {tarefas.map((t) => (
          <li key={t.id} className={styles.li}>
            <div>
              <input
                type="checkbox"
                checked={t.check}
                onChange={() => toggleCheck(t.id)}
                className={styles.check}
              />
              <span>{t.nome}</span>
            </div>
            <span
              className={`${styles.delete} bi bi-trash`}
              onClick={() => deletar(t.id)}
            >
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
