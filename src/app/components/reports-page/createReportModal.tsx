"use client";

import { useState } from "react";
import styles from "./report.module.css";
import type { TipoRelatorio } from "./types";
import {
  TIPOS,
  lerErro,
  periodoDoAtalho,
  type Atalho,
} from "./utils";

interface Props {
  usuarioId: string;
  onClose: () => void;
  onCreated: () => void;
}

type Erros = Partial<
  Record<"titulo" | "tipo" | "dataInicio" | "dataFim", string>
>;

const ATALHOS: { id: Atalho; rotulo: string }[] = [
  { id: "ultimos7", rotulo: "Últimos 7 dias" },
  { id: "ultimos30", rotulo: "Últimos 30 dias" },
  { id: "mes", rotulo: "Este mês" },
];

export default function CreateReportModal({
  usuarioId,
  onClose,
  onCreated,
}: Props) {
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState<TipoRelatorio | "">("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [feedback, setFeedback] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function aplicarAtalho(atalho: Atalho) {
    const { inicio, fim } = periodoDoAtalho(atalho);
    setDataInicio(inicio);
    setDataFim(fim);
    setErros((prev) => ({
      ...prev,
      dataInicio: undefined,
      dataFim: undefined,
    }));
  }

  function validar(): Erros {
    const novos: Erros = {};
    if (!titulo.trim()) novos.titulo = "Informe um título.";
    if (!TIPOS.some((t) => t.valor === tipo)) novos.tipo = "Selecione um tipo.";
    if (!dataInicio) novos.dataInicio = "Informe a data de início.";
    if (!dataFim) novos.dataFim = "Informe a data de fim.";
    if (dataInicio && dataFim && dataFim < dataInicio) {
      novos.dataFim = "A data final não pode ser anterior à inicial.";
    }
    return novos;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErroEnvio(null);

    const novosErros = validar();
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setEnviando(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/relatorio`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario_id: usuarioId,
            titulo: titulo.trim(),
            tipo,
            data_inicio: dataInicio,
            data_fim: dataFim,
            feedback: feedback.trim() || null,
          }),
        },
      );

      if (!res.ok)
        throw new Error(await lerErro(res, "Erro ao criar relatório."));

      onCreated();
      onClose();
    } catch (err) {
      setErroEnvio(
        err instanceof Error ? err.message : "Erro ao criar relatório.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-titulo" className={styles.modalTitulo}>
          Novo relatório
        </h2>

        <form className={styles.formulario} onSubmit={handleSubmit} noValidate>
          <div className={styles.campo}>
            <label className={styles.rotulo} htmlFor="rel-titulo">
              Título
            </label>
            <input
              id="rel-titulo"
              className={styles.input}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
            {erros.titulo && (
              <span className={styles.erroCampo}>{erros.titulo}</span>
            )}
          </div>

          <div className={styles.campo}>
            <label className={styles.rotulo} htmlFor="rel-tipo">
              Tipo
            </label>
            <select
              id="rel-tipo"
              className={styles.input}
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoRelatorio | "")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {TIPOS.map((t) => (
                <option key={t.valor} value={t.valor}>
                  {t.rotulo}
                </option>
              ))}
            </select>
            {erros.tipo && (
              <span className={styles.erroCampo}>{erros.tipo}</span>
            )}
          </div>

          <div className={styles.atalhos}>
            {ATALHOS.map((a) => (
              <button
                key={a.id}
                type="button"
                className={styles.atalho}
                onClick={() => aplicarAtalho(a.id)}
              >
                {a.rotulo}
              </button>
            ))}
          </div>

          <div className={styles.linhaDatas}>
            <div className={styles.campo}>
              <label className={styles.rotulo} htmlFor="rel-inicio">
                Data de início
              </label>
              <input
                id="rel-inicio"
                type="date"
                className={styles.input}
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
              {erros.dataInicio && (
                <span className={styles.erroCampo}>{erros.dataInicio}</span>
              )}
            </div>

            <div className={styles.campo}>
              <label className={styles.rotulo} htmlFor="rel-fim">
                Data de fim
              </label>
              <input
                id="rel-fim"
                type="date"
                className={styles.input}
                value={dataFim}
                min={dataInicio || undefined}
                onChange={(e) => setDataFim(e.target.value)}
              />
              {erros.dataFim && (
                <span className={styles.erroCampo}>{erros.dataFim}</span>
              )}
            </div>
          </div>

          <div className={styles.campo}>
            <label className={styles.rotulo} htmlFor="rel-feedback">
              Feedback (opcional)
            </label>
            <textarea
              id="rel-feedback"
              className={`${styles.input} ${styles.textarea}`}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {erroEnvio && <div className={styles.mensagemErro}>{erroEnvio}</div>}

          <div className={styles.acoes}>
            <button
              type="button"
              className={styles.botaoSecundario}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.botaoPrimario}
              disabled={enviando}
            >
              {enviando ? "Criando..." : "Criar relatório"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
