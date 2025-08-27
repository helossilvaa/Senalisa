"use client";

import { useEffect, useState } from "react";
import Card from '@/components/Card/Card';
import HeaderTecnico from '@/components/HeaderTecnico/headerTecnico';
import styles from '@/app/tecnico/meusChamados/page.module.css';

export default function MeusChamados() {
    const [chamadas, setChamadas] = useState([]);

    useEffect(() => {
        async function fetchChamados() {
            try {
                const res = await fetch("http://localhost:3000/api/chamados/meuschamados", {
                    credentials: "include",
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                const data = await res.json();
                setChamadas(data);
            } catch (err) {
                console.error("Erro ao buscar chamados:", err);
            }
        }
        fetchChamados();
    }, []);

    return (
        <div className={styles.container}>
            <HeaderTecnico />
            <div className={styles.chamadas}>
                <div className={styles.titulo}>
                    <h1>Meus Chamados</h1>
                </div>

                <div className={styles.card}>
                    {chamadas.map((chamada) => (
                        <Card 
                            key={chamada.id} 
                            titulo={chamada.titulo} 
                            data={new Date(chamada.criado_em).toLocaleDateString()} 
                            id={chamada.id} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}