

"use client";
import styles from "@/app/(private)/sessions-study/SessionStudy.module.css";


export default function LivreForm({
  dados,
  setDados,
}) {
  return (
    <div className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <label>Meta do estudo</label>

        <textarea
          className={styles.textarea}
          placeholder="O que você pretende estudar?"
          value={dados.meta}
          onChange={(e) =>
            setDados({
              ...dados,
              meta: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}