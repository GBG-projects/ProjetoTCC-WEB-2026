export type TipoRelatorio = 'disciplina' | 'questao' | 'geral'

export interface Relatorio {
  id: number
  usuario_id: string
  titulo: string | null
  tipo: TipoRelatorio
  data_inicio: string
  data_fim: string
  feedback: string | null
}

export interface RelatorioDisciplina {
  id: number
  relatorio_id: number
  disciplina_id: number | null
  horas_estudadas: string
  disciplina_nome: string | null
}

export interface RelatorioQuestao {
  id: number
  relatorio_id: number
  disciplina_id: number | null
  prova_id: number | null
  quantidade_questoes: number
  quantidade_acertos: number
  disciplina_nome: string | null
  prova_titulo: string | null
}

export interface RelatorioDetalhe extends Relatorio {
  relatorio_disciplina: RelatorioDisciplina[]
  relatorio_questao: RelatorioQuestao[]
}