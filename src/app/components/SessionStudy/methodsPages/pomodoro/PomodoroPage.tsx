"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Timer, Check, X, Sprout, RefreshCw, Loader2 } from "lucide-react";
import styles from "./pomodoro.module.css";

const DURACAO_PAUSA = 300; // precisa bater com o valor fixo do backend

type Fase = "foco" | "pausa" | "concluido";
type Status = "ativo" | "pausado" | "concluido";

interface PomodoroData {
  id: number;
  sessao_id: number;
  duracao: number;
  ciclos: number;
  status: Status;
  iniciado_em: string | null;
  tempo_gasto: number;
  criado_em: string;
  titulo: string;
  fase: Fase;
  ciclo_atual: number;
  tempo_restante_fase: number;
}

const RAIO = 130;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

function formatarTempo(segundos: number) {
  const seguro = Math.max(0, Math.round(segundos));
  const m = Math.floor(seguro / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seguro % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

interface PomodoroPageProps {
  pomodoro_id: string;
}

export default function PomodoroPage({ pomodoro_id: id }: PomodoroPageProps) {
  const router = useRouter();

  const [pomodoro, setPomodoro] = useState<PomodoroData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [acaoEmCurso, setAcaoEmCurso] = useState<"iniciar" | "concluir" | "cancelar" | null>(null);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const buscarEstado = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pomodoro/${id}`, { cache: "no-store" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Erro ao buscar pomodoro");
      }
      const data: PomodoroData = await res.json();
      setPomodoro(data);
      setErro(null);
      return data;
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao buscar pomodoro");
      return null;
    }
  }, [id]);

  // Busca inicial
  useEffect(() => {
    if (!id) return;
    setCarregando(true);
    buscarEstado().finally(() => setCarregando(false));
  }, [id, buscarEstado]);

  // Polling enquanto ativo
  useEffect(() => {
    const deveFazerPolling = pomodoro?.status === "ativo" && pomodoro.fase !== "concluido";

    if (deveFazerPolling) {
      pollingRef.current = setInterval(() => {
        buscarEstado();
      }, 1000);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [pomodoro?.status, pomodoro?.fase, buscarEstado]);

  async function iniciar() {
    setAcaoEmCurso("iniciar");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pomodoro/${id}/iniciar`, { method: "POST" });
      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body?.message ?? "Erro ao iniciar pomodoro");
      }
      await buscarEstado();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao iniciar pomodoro");
    } finally {
      setAcaoEmCurso(null);
    }
  }

  async function concluir() {
    setAcaoEmCurso("concluir");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pomodoro/${id}/concluir`, { method: "POST" });
      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body?.message ?? "Erro ao concluir pomodoro");
      }
      if (pollingRef.current) clearInterval(pollingRef.current);
      await buscarEstado();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao concluir pomodoro");
    } finally {
      setAcaoEmCurso(null);
    }
  }

  async function cancelar() {
    setAcaoEmCurso("cancelar");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pomodoro/${id}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body?.message ?? "Erro ao cancelar pomodoro");
      }
      if (pollingRef.current) clearInterval(pollingRef.current);
      router.back();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao cancelar pomodoro");
      setAcaoEmCurso(null);
    }
  }

  // Duração total da fase atual, pra calcular o progresso do círculo
  const duracaoFaseAtual = useMemo(() => {
    if (!pomodoro) return 0;
    if (pomodoro.fase === "foco") return pomodoro.duracao;
    if (pomodoro.fase === "pausa") return DURACAO_PAUSA;
    return 0;
  }, [pomodoro]);

  const progresso = useMemo(() => {
    if (!pomodoro || duracaoFaseAtual === 0) return pomodoro?.fase === "concluido" ? 1 : 0;
    const decorrido = duracaoFaseAtual - pomodoro.tempo_restante_fase;
    return Math.min(1, Math.max(0, decorrido / duracaoFaseAtual));
  }, [pomodoro, duracaoFaseAtual]);

  const dashOffset = CIRCUNFERENCIA * (1 - progresso);

  const anguloRad = progresso * 2 * Math.PI - Math.PI / 2;
  const pontoX = 150 + RAIO * Math.cos(anguloRad);
  const pontoY = 150 + RAIO * Math.sin(anguloRad);

  if (carregando) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={`${styles.card} ${styles.main}`}>
            <Loader2 className={styles.spinner} />
            <p className={styles.subtitle}>Carregando pomodoro...</p>
          </div>
        </div>
      </div>
    );
  }

  if (erro && !pomodoro) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={`${styles.card} ${styles.main}`}>
            <p className={styles.subtitle}>{erro}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!pomodoro) return null;

  const naoIniciado = pomodoro.status !== "ativo" && pomodoro.status !== "concluido";
  const concluido = pomodoro.status === "concluido" || pomodoro.fase === "concluido";
  const ciclosRestantes = Math.max(0, pomodoro.ciclos - pomodoro.ciclo_atual);

  return (
    <div className={styles.page}>
      <img src="/logoFocus.png" alt="Focus Flow" className={styles.logo} />

      <div className={styles.content}>
        <div className={`${styles.card} ${styles.main}`}>
          <div className={styles.header}>
            <div className={styles.headerTitleRow}>
              <Timer />
              <span className={styles.title}>{pomodoro.titulo || "Pomodoro"}</span>
            </div>
            <p className={styles.subtitle}>
              {concluido
                ? "Sessão concluída. Bom trabalho!"
                : pomodoro.fase === "foco"
                ? "Mantenha o foco e vá além."
                : pomodoro.fase === "pausa"
                ? "Aproveite a pausa, você merece."
                : "Pronto pra começar?"}
            </p>

            {!naoIniciado && (
              <span
                className={`${styles.cicloBadge} ${
                  pomodoro.fase === "pausa" ? styles.cicloBadgePausa : ""
                }`}
              >
                <RefreshCw />
                Ciclo {pomodoro.ciclo_atual} de {pomodoro.ciclos}
                {!concluido &&
                  ciclosRestantes > 0 &&
                  ` · ${ciclosRestantes} restante${ciclosRestantes > 1 ? "s" : ""}`}
              </span>
            )}
          </div>

          <div className={styles.timerWrapper}>
            <svg viewBox="0 0 300 300" className={styles.timerSvg}>
              <circle cx="150" cy="150" r={RAIO} className={styles.trackCircle} />
              <circle
                cx="150"
                cy="150"
                r={RAIO}
                className={`${styles.progressCircle} ${
                  pomodoro.fase === "pausa" ? styles.progressCirclePausa : ""
                }`}
                strokeDasharray={CIRCUNFERENCIA}
                strokeDashoffset={dashOffset}
              />
            </svg>
            {!concluido && (
              <svg
                viewBox="0 0 300 300"
                className={styles.timerSvg}
                style={{ transform: "none", position: "absolute", inset: 0 }}
              >
                <circle cx={pontoX} cy={pontoY} r={7} className={styles.progressDot} />
              </svg>
            )}

            <div className={styles.timerCenter}>
              <span className={styles.timerModo}>
                {naoIniciado ? "Aguardando" : concluido ? "Concluído" : pomodoro.fase === "foco" ? "Foco" : "Pausa"}
              </span>
              <span className={styles.timerValor}>
                {naoIniciado
                  ? formatarTempo(pomodoro.duracao)
                  : concluido
                  ? "00:00"
                  : formatarTempo(pomodoro.tempo_restante_fase)}
              </span>
              {!concluido && (
                <span className={styles.timerTotal}>
                  de {formatarTempo(naoIniciado ? pomodoro.duracao : duracaoFaseAtual)}
                </span>
              )}
            </div>
          </div>

          {erro && <p className={styles.erroTexto}>{erro}</p>}

          {!concluido && (
            <div className={styles.controlsRow}>
              {naoIniciado ? (
                <button
                  className={`${styles.controlBtn} ${styles.controlBtnPrimario}`}
                  onClick={iniciar}
                  disabled={acaoEmCurso !== null}
                >
                  {acaoEmCurso === "iniciar" ? <Loader2 className={styles.spinnerSmall} /> : <Timer />}
                  Iniciar
                </button>
              ) : (
                <button
                  className={`${styles.controlBtn} ${styles.controlBtnPrimario}`}
                  onClick={concluir}
                  disabled={acaoEmCurso !== null}
                >
                  {acaoEmCurso === "concluir" ? <Loader2 className={styles.spinnerSmall} /> : <Check />}
                  Concluir
                </button>
              )}
              <button className={styles.controlBtn} onClick={cancelar} disabled={acaoEmCurso !== null}>
                {acaoEmCurso === "cancelar" ? <Loader2 className={styles.spinnerSmall} /> : <X />}
                Cancelar
              </button>
            </div>
          )}

          <div className={styles.dica}>
            <Sprout />
            Distrações não constroem o futuro.
          </div>
        </div>
      </div>
    </div>
  );
}