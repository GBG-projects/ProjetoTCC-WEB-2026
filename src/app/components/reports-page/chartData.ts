import type {
  RelatorioDisciplina,
  RelatorioQuestao,
} from "./types";

export const SEM_DISCIPLINA = "Sem disciplina";

export interface HorasPorDisciplina {
  disciplina: string;
  horas: number;
}

export interface QuestoesPorDisciplina {
  disciplina: string;
  respondidas: number;
  acertadas: number;
}

export function dadosHoras(
  linhas: RelatorioDisciplina[],
): HorasPorDisciplina[] {
  const mapa = new Map<string, number>();

  for (const linha of linhas) {
    const nome = linha.disciplina_nome ?? SEM_DISCIPLINA;
    mapa.set(nome, (mapa.get(nome) ?? 0) + Number(linha.horas_estudadas));
  }

  return Array.from(mapa, ([disciplina, horas]) => ({
    disciplina,
    horas,
  })).sort((a, b) => b.horas - a.horas);
}

export function dadosQuestoes(
  linhas: RelatorioQuestao[],
): QuestoesPorDisciplina[] {
  const mapa = new Map<string, { respondidas: number; acertadas: number }>();

  for (const linha of linhas) {
    const nome = linha.disciplina_nome ?? SEM_DISCIPLINA;
    const atual = mapa.get(nome) ?? { respondidas: 0, acertadas: 0 };
    atual.respondidas += Number(linha.quantidade_questoes);
    atual.acertadas += Number(linha.quantidade_acertos);
    mapa.set(nome, atual);
  }

  return Array.from(mapa, ([disciplina, valores]) => ({
    disciplina,
    ...valores,
  })).sort((a, b) => b.respondidas - a.respondidas);
}

export function formatarHoras(valor: unknown): string {
  return `${Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} h`;
}

export function abreviar(texto: string, max = 16): string {
  return texto.length > max ? `${texto.slice(0, max - 1)}…` : texto;
}
