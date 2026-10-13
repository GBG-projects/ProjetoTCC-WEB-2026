'use client'

import { useEffect, useState } from 'react'
import styles from './report.module.css'
import type { Relatorio, TipoRelatorio } from './types'
import { lerErro } from './utils'
import ReportCard from './components/reportCard'
import ReportFilters from './components/reportFilters'
import CreateReportModal from './components/createReportModal'
import { useUser } from '@/app/contexts/UserContext'

export default function ReportPage() {
  const { user, loading: carregandoUsuario } = useUser()
  const usuarioId = user?.id

  const [relatorios, setRelatorios] = useState<Relatorio[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [tipo, setTipo] = useState<TipoRelatorio | ''>('')
  const [de, setDe] = useState('')
  const [ate, setAte] = useState('')
  const [recarga, setRecarga] = useState(0)
  const [modalAberto, setModalAberto] = useState(false)
  const [excluindoId, setExcluindoId] = useState<number | null>(null)
  const [erroExclusao, setErroExclusao] = useState<string | null>(null)

  const periodoInvalido = Boolean(de && ate && ate < de)
  const temFiltro = Boolean(tipo || de || ate)

  useEffect(() => {
    if (!usuarioId || periodoInvalido) return

    const controller = new AbortController()

    async function carregar() {
      setCarregando(true)
      setErro(null)

      try {
        const params = new URLSearchParams()
        if (tipo) params.set('tipo', tipo)
        if (de) params.set('de', de)
        if (ate) params.set('ate', ate)
        const query = params.toString()

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/relatorio/usuario/${usuarioId}${query ? `?${query}` : ''}`,
          { signal: controller.signal }
        )

        if (!res.ok) throw new Error(await lerErro(res, 'Erro ao carregar relatórios.'))

        setRelatorios(await res.json())
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return
        setErro(e instanceof Error ? e.message : 'Erro ao carregar relatórios.')
      } finally {
        if (!controller.signal.aborted) setCarregando(false)
      }
    }

    carregar()

    return () => controller.abort()
  }, [usuarioId, tipo, de, ate, recarga, periodoInvalido])

  async function excluir(id: number) {
    if (!usuarioId) return

    setExcluindoId(id)
    setErroExclusao(null)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/relatorio/${id}?usuario_id=${encodeURIComponent(usuarioId)}`,
        { method: 'DELETE' }
      )

      if (!res.ok) throw new Error(await lerErro(res, 'Erro ao excluir relatório.'))

      setRelatorios((prev) => prev.filter((r) => r.id !== id))
    } catch (e) {
      setErroExclusao(e instanceof Error ? e.message : 'Erro ao excluir relatório.')
    } finally {
      setExcluindoId(null)
    }
  }

  function limparFiltros() {
    setTipo('')
    setDe('')
    setAte('')
  }

  if (carregandoUsuario) {
    return <div className={styles.container}><p className={styles.mensagem}>Carregando...</p></div>
  }

  if (!usuarioId) {
    return (
      <div className={styles.container}>
        <p className={styles.mensagem}>Faça login para ver seus relatórios.</p>
      </div>
    )
  }

    return (
    <div className={styles.container}>
      <div className={styles.blobTopRight} />
      <div className={styles.blobTopRightSmall} />
      <div className={styles.blobBottomLeft} />
      <div className={styles.blobBottomLeftSmall} />

      <div className={styles.painel}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Relatórios</h1>
          <button type="button" className={styles.botaoPrimario} onClick={() => setModalAberto(true)}>
            Novo relatório
          </button>
        </div>

        <ReportFilters
          tipo={tipo}
          de={de}
          ate={ate}
          onTipoChange={setTipo}
          onDeChange={setDe}
          onAteChange={setAte}
          onLimpar={limparFiltros}
        />

        {erroExclusao && <div className={styles.mensagemErro}>{erroExclusao}</div>}

        {periodoInvalido ? (
          <div className={styles.mensagemErro}>A data inicial não pode ser posterior à data final.</div>
        ) : carregando ? (
          <p className={styles.mensagem}>Carregando relatórios...</p>
        ) : erro ? (
          <div className={styles.mensagemErro}>{erro}</div>
        ) : relatorios.length === 0 ? (
          <p className={styles.mensagem}>
            {temFiltro
              ? 'Nenhum relatório encontrado para os filtros selecionados.'
              : 'Você ainda não criou nenhum relatório.'}
          </p>
        ) : (
          <div className={styles.grid}>
            {relatorios.map((relatorio) => (
              <ReportCard
                key={relatorio.id}
                relatorio={relatorio}
                excluindo={excluindoId === relatorio.id}
                onExcluir={excluir}
              />
            ))}
          </div>
        )}
      </div>

      {modalAberto && (
        <CreateReportModal
          usuarioId={usuarioId}
          onClose={() => setModalAberto(false)}
          onCreated={() => setRecarga((n) => n + 1)}
        />
      )}
    </div>
  )
}