"use client";

import Card from '@/components/Card/Card';
import HeaderTecnico from '@/components/HeaderTecnico/headerTecnico';
import styles from '@/app/tecnico/Chamadas/page.module.css';

export default function Chamadas() {

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
    return (
        <>
            <div className={styles.container}>
                <HeaderTecnico />
                <div className={styles.chamadas}>
                    <div className={styles.titulo}>
                        <h1>Chamados Pendentes</h1>
                    </div>
                    <div className={styles.card}>
                        {infoChamadas.map((chamada) => (
                            <Card key={chamada.id} titulo={chamada.titulo} data={chamada.data} id={chamada.id} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}