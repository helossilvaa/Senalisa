"use client";
 
import { useEffect } from "react";
import styles from "@/components/Calendario/page.module.css";

export default function CalendarPage({ onDateSelect }) {

  useEffect(() => {
    (async () => {
      const calendarModule = await import("./Calendar.js");
      if (calendarModule.default) {
        // Passa a função para o script de inicialização do calendário
        calendarModule.default(styles, onDateSelect); 
      }
    })();
  }, [onDateSelect]); // A dependência garante que o useEffect rode se o callback mudar

  return (
    <>
      <div className="justify-content-center align-items-center d-flex mt-2">
        <div className={styles.calendario}>
          <div className={styles.calendarioitens}>
            <div className={styles.header}>
              <div id="prev" className={styles.btn}>
                <i className="bi bi-arrow-left"></i>
              </div>
              <div id="month-year" className={styles.monthYear}></div>
              <div id="next" className={styles.btn}>
                <i className="bi bi-arrow-right"></i>
              </div>
            </div>
            <div className={styles.semanaDias}>
              <p>Dom</p>
              <p>Seg</p>
              <p>Ter</p>
              <p>Qua</p>
              <p>Qui</p>
              <p>Sex</p>
              <p>Sáb</p>
            </div>
            <div className={styles.diasdasemana}>
              <div className={styles.days} id="days">
              </div>
            </div>
          </div>
 
        </div>
      </div>
    </>
  );
}