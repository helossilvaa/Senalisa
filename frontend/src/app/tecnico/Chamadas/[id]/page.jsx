import styles from "./page.module.css";
import HeaderTecnico from "@/components/HeaderTecnico/headerTecnico";

export default function InfoPage({ params }) {
  const { id } = params;
  const infos = infos.find((s) => s.id === parseInt(id));

  if (!infos) {
    return <div>Sala não encontrada</div>;
  }

  return (
    <>
      <HeaderTecnico/>
      
    </>
  );
}