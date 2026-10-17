import type { Relatorio, TipoRelatorio } from "./types";

export const TIPOS: { valor: TipoRelatorio; rotulo: string }[] = [
  { valor: "disciplina", rotulo: "Disciplina" },
  { valor: "questao", rotulo: "Questões" },
  { valor: "geral", rotulo: "Geral" },
];

export type Atalho = "ultimos7" | "ultimos30" | "mes";

export function rotuloTipo(tipo: TipoRelatorio): string {
  return TIPOS.find((t) => t.valor === tipo)?.rotulo ?? tipo;
}

export function paraInputData(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function periodoDoAtalho(atalho: Atalho): {
  inicio: string;
  fim: string;
} {
  const agora = new Date();
  const fim = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const inicio = new Date(fim);

  if (atalho === "ultimos7") inicio.setDate(fim.getDate() - 6);
  else if (atalho === "ultimos30") inicio.setDate(fim.getDate() - 29);
  else inicio.setDate(1);

  return { inicio: paraInputData(inicio), fim: paraInputData(fim) };
}

export function formatarData(valor: string): string {
  const [ano, mes, dia] = valor.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarPeriodo(inicio: string, fim: string): string {
  return `${formatarData(inicio)} a ${formatarData(fim)}`;
}

export function tituloExibicao(relatorio: Relatorio): string {
  return relatorio.titulo?.trim() || "Sem título";
}

export async function lerErro(res: Response, padrao: string): Promise<string> {
  try {
    const dados = await res.json();
    return typeof dados?.erro === "string" ? dados.erro : padrao;
  } catch {
    return padrao;
  }
}
