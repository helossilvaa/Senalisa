import Card from '@/components/Card/Card';
import HeaderTecnico from '@/components/HeaderTecnico/headerTecnico';
import styles from './page.module.css';

export default async function MeusChamadosPage() {
  const tecnicoId = 1; // Substitua aqui pelo ID do técnico logado
  const chamados = await getChamadosDoTecnico(tecnicoId);

  return (
    <div className={styles.container}>
      <HeaderTecnico />
      <div className={styles.chamadas}>
        <div className={styles.titulo}>
          <h1>Meus Chamados</h1>
        </div>

        <div className={styles.card}>
          {chamados.length === 0 ? (
            <p>Nenhum chamado aceito ainda.</p>
          ) : (
            chamados.map((chamada) => (
              <Card
                key={chamada.id}
                titulo={chamada.titulo}
                data={new Date(chamada.atualizado_em).toLocaleDateString()}
                id={chamada.id}
                mostrarBotaoAceitar={false} // não mostrar botão aceitar, pois já está aceito
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
