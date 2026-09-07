 import styles from "@/app/(private)/sessions-study/SessionStudy.module.css";
import { Check } from "lucide-react";

 
 export default function MetodoCard({
  metodo,
  selecionado,
  onSelect,
}) {
  const Icon = metodo.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(metodo.id)}
      className={`${styles.metodoCard} ${
        selecionado ? styles.metodoCardSelecionado : ""
      }`}
    >
      {selecionado && (
        <span className={styles.metodoCheck}>
          <Check />
        </span>
      )}

      <span className={`${styles.metodoIcon} ${styles[metodo.badgeClass]}`}>
        <Icon />
      </span>

      <span className={styles.metodoLabel}>
        {metodo.label}
      </span>

      <span className={styles.metodoDesc}>
        {metodo.desc}
      </span>
    </button>
  );
}