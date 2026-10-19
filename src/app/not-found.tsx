import Link from "next/link";
import styles from "./not-found.module.css";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const celulas = Array.from({ length: 35 }, (_, i) => i - 3);
const DIA_PERDIDO = 18;

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      <nav className={`${styles.wrap} ${styles.nav}`}>
        <Link href="/" className={styles.brand}>
          Focus Flow
        </Link>
      </nav>

      <main className={`${styles.wrap} ${styles.main}`}>
        <div>
          <p className={styles.codigo}>Erro 404</p>
          <h1 className={styles.title}>
            Nada marcado <span className={styles.marca}>para esta página</span>.
          </h1>
          <p className={styles.subtitle}>
            O endereço que você abriu não existe ou foi movido. Volte ao início
            e continue de onde parou.
          </p>
          <div className={styles.actions}>
            <Link href="/dashboard" className={styles.btnPrimary}>
              Ir para o Dashboard
            </Link>
            <Link href="/" className={styles.linkSecundario}>
              Voltar ao início
            </Link>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.cal}>
            <div className={styles.calHeader}>
              <strong>Outubro</strong>
              <span>0 compromissos</span>
            </div>
            <div className={styles.calWeek}>
              {DIAS_SEMANA.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div className={styles.calGrid}>
              {celulas.map((dia, i) => {
                const valido = dia >= 1 && dia <= 31;
                const perdido = dia === DIA_PERDIDO;
                const cls = [
                  styles.cell,
                  !valido ? styles.cellVazia : "",
                  perdido ? styles.cellPerdida : "",
                ].join(" ");
                return (
                  <span key={i} className={cls}>
                    {perdido ? "404" : valido ? dia : ""}
                  </span>
                );
              })}
            </div>
          </div>

          <div className={styles.toast}>Nenhum compromisso neste dia.</div>
        </div>
      </main>

      <footer className={`${styles.wrap} ${styles.footer}`}>
        &copy; {new Date().getFullYear()} Focus Flow · Projeto de TCC
      </footer>
    </div>
  );
}
