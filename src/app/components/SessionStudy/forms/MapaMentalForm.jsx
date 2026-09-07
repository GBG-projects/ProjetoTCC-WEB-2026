
"use client";
import styles from "@/app/(private)/sessions-study/SessionStudy.module.css";


export default function MapaMentalForm({
  dados,
  setDados,
}) {
  return (
    <div className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <label>Descrição</label>

        <textarea
          className={styles.textarea}
          placeholder="Descreva o tema do mapa mental..."
          value={dados.descricao}
          onChange={(e) =>
            setDados({
              ...dados,
              descricao: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}