import styles from "./report.module.css";
import type { TipoRelatorio } from "./types";
import { TIPOS } from "@/app/components/reports-page/utils";

interface Props {
  tipo: TipoRelatorio | "";
  de: string;
  ate: string;
  onTipoChange: (valor: TipoRelatorio | "") => void;
  onDeChange: (valor: string) => void;
  onAteChange: (valor: string) => void;
  onLimpar: () => void;
}

export default function ReportFilters({
  tipo,
  de,
  ate,
  onTipoChange,
  onDeChange,
  onAteChange,
  onLimpar,
}: Props) {
  const temFiltro = Boolean(tipo || de || ate);

  return (
    <div className={styles.filtros}>
      <div className={styles.campo}>
        <label className={styles.rotulo} htmlFor="filtro-tipo">
          Tipo
        </label>
        <select
          id="filtro-tipo"
          className={styles.input}
          value={tipo}
          onChange={(e) => onTipoChange(e.target.value as TipoRelatorio | "")}
        >
          <option value="">Todos</option>
          {TIPOS.map((t) => (
            <option key={t.valor} value={t.valor}>
              {t.rotulo}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.campo}>
        <label className={styles.rotulo} htmlFor="filtro-de">
          De
        </label>
        <input
          id="filtro-de"
          type="date"
          className={styles.input}
          value={de}
          onChange={(e) => onDeChange(e.target.value)}
        />
      </div>

      <div className={styles.campo}>
        <label className={styles.rotulo} htmlFor="filtro-ate">
          Até
        </label>
        <input
          id="filtro-ate"
          type="date"
          className={styles.input}
          value={ate}
          min={de || undefined}
          onChange={(e) => onAteChange(e.target.value)}
        />
      </div>

      {temFiltro && (
        <button
          type="button"
          className={styles.botaoSecundario}
          onClick={onLimpar}
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
