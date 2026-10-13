import Link from 'next/link'
import styles from '../report.module.css'
import type { Relatorio } from '../types'
import { formatarPeriodo, rotuloTipo, tituloExibicao } from '../utils'

interface Props {
  relatorio: Relatorio
  excluindo: boolean
  onExcluir: (id: number) => void
}

export default function ReportCard({ relatorio, excluindo, onExcluir }: Props) {
  return (
    <article className={styles.card}>
      <Link href={`/report/${relatorio.id}`} className={styles.cardLink}>
        <h2 className={styles.cardTitulo}>{tituloExibicao(relatorio)}</h2>
        <span className={styles.badge}>{rotuloTipo(relatorio.tipo)}</span>
        <span className={styles.periodo}>
          {formatarPeriodo(relatorio.data_inicio, relatorio.data_fim)}
        </span>
      </Link>
      <div className={styles.cardRodape}>
        <button
          type="button"
          className={styles.botaoExcluir}
          disabled={excluindo}
          onClick={() => onExcluir(relatorio.id)}
        >
          {excluindo ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </article>
  )
}