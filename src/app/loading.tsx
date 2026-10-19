import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.page} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <p className={styles.texto}>
        Carregando<span className={styles.pontos} aria-hidden="true" />
      </p>
    </div>
  );
}