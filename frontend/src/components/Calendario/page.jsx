"use client";

import { useEffect } from "react";
import styles from "@/components/Calendario/page.module.css";

export default function CalendarPage() {
  useEffect(() => {
    (async () => {
      const calendarModule = await import("./Calendar.js");
      if (calendarModule.default) { calendarModule.default(styles); }
    })();
  }, []);

  return (
    <>
      <div className={styles.calendario}>
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
          <div>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sab</div>
        </div>
        <div className={styles.days} id="days">
        </div>
      </div>
    </>);
}