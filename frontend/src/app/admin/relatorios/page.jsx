import Relatorios from "@/components/Relatorios/relatorios";
import HeaderAdmin from "@/components/HeaderAdmin/headerAdmin";
import styles from "./page.module.css"

export default function () {
    return(
        <div className={styles.page}>
        <HeaderAdmin/>
        <div className="container-fluid p-4">
        <Relatorios/>
        </div>
        </div>
    )
}

