"use client";

import styles from "@/app/(private)/sessions-study/SessionStudy.module.css";

export default function PomodoroForm({ dados, setDados }) {
  return (
    <div className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <label>Duração do foco (minutos)</label>

        <input
          type="number"
          className={styles.input}
          placeholder="25"
          value={dados.duracao ?? ""}
          onChange={(e) =>
            setDados({
              ...dados,
              duracao: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Número de ciclos</label>

        <input
          type="number"
          className={styles.input}
          placeholder="4"
          value={dados.ciclos ?? ""}
          onChange={(e) =>
            setDados({
              ...dados,
              ciclos: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
        />
      </div>
    </div>
  );
}