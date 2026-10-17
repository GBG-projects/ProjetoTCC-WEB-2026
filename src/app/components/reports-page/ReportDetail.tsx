"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import styles from "./report.module.css";
import type { RelatorioDetalhe } from "./types";
import {
  formatarPeriodo,
  lerErro,
  rotuloTipo,
  tituloExibicao,
} from "@/app/components/reports-page/utils";
import { dadosHoras, dadosQuestoes } from "./chartData";
import HorasChart from "./horasCharts";
import QuestoesChart from "./questoesChart";
import { useUser } from "@/app/contexts/UserContext";
interface Props {
  id: string;
}

function Moldura({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <div className={styles.blobTopRight} />
      <div className={styles.blobTopRightSmall} />
      <div className={styles.blobBottomLeft} />
      <div className={styles.blobBottomLeftSmall} />

      <div className={styles.painel}>
        <Link href="/report" className={styles.voltar}>
          ← Voltar
        </Link>
        {children}
      </div>
    </div>
  );
}

export default function ReportDetail({ id }: Props) {
  const { user, loading: carregandoUsuario } = useUser();
  const usuarioId = user?.id;

  const [relatorio, setRelatorio] = useState<RelatorioDetalhe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!usuarioId) return;

    const controller = new AbortController();

    async function carregar() {
      setCarregando(true);
      setErro(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/relatorio/${id}`,
          {
            signal: controller.signal,
          },
        );

        if (!res.ok)
          throw new Error(await lerErro(res, "Erro ao carregar relatório."));

        const dados: RelatorioDetalhe = await res.json();

        if (String(dados.usuario_id) !== String(usuarioId)) {
          throw new Error("Relatório não encontrado.");
        }

        setRelatorio(dados);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setRelatorio(null);
        setErro(e instanceof Error ? e.message : "Erro ao carregar relatório.");
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    carregar();

    return () => controller.abort();
  }, [id, usuarioId]);

  if (carregandoUsuario) {
    return (
      <Moldura>
        <p className={styles.mensagem}>Carregando...</p>
      </Moldura>
    );
  }

  if (!usuarioId) {
    return (
      <Moldura>
        <p className={styles.mensagem}>Faça login para ver este relatório.</p>
      </Moldura>
    );
  }

  if (carregando) {
    return (
      <Moldura>
        <p className={styles.mensagem}>Carregando relatório...</p>
      </Moldura>
    );
  }

  if (erro || !relatorio) {
    return (
      <Moldura>
        <div className={styles.mensagemErro}>
          {erro ?? "Relatório não encontrado."}
        </div>
      </Moldura>
    );
  }

  const mostrarHoras =
    relatorio.tipo === "disciplina" || relatorio.tipo === "geral";
  const mostrarQuestoes =
    relatorio.tipo === "questao" || relatorio.tipo === "geral";
  const feedback = relatorio.feedback?.trim();

  return (
    <Moldura>
      <div className={styles.detalheTopo}>
        <h1 className={styles.detalheTitulo}>{tituloExibicao(relatorio)}</h1>
        <div className={styles.metaLinha}>
          <span className={styles.badge}>{rotuloTipo(relatorio.tipo)}</span>
          <span className={styles.periodo}>
            {formatarPeriodo(relatorio.data_inicio, relatorio.data_fim)}
          </span>
        </div>
      </div>

      {feedback && <p className={styles.feedback}>{feedback}</p>}

      {mostrarHoras && (
        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Horas estudadas por disciplina</h2>
          <HorasChart dados={dadosHoras(relatorio.relatorio_disciplina)} />
        </section>
      )}

      {mostrarQuestoes && (
        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>
            Questões respondidas e acertadas por disciplina
          </h2>
          <QuestoesChart dados={dadosQuestoes(relatorio.relatorio_questao)} />
        </section>
      )}
    </Moldura>
  );
}
