"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Timer, Pause, Play, X, Sprout, RefreshCw } from "lucide-react";
import styles from "./pomodoro.module.css";


const PAUSA_MINUTOS = 5;


const RAIO = 130;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

type Modo = "ativo" | "pausado" | "concluido";

type Pomodoro = {
    sessao_id:number;
duracao:number;
ciclos:number;
status:Modo;
id:number;
titulo:string;
}
function formatarTempo(segundos: number) {
  const m = Math.floor(segundos / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(segundos % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function PomodoroPage({
    params,
}: {
  params: { id: string };
}
) {

    
    const [modo, setModo] = useState<Modo>("pausado");
    const [cicloAtual, setCicloAtual] = useState(1);
    const [duracaoTotal, setDuracaoTotal] = useState(0);
    const [tempoRestante, setTempoRestante] = useState(0);
    const [rodando, setRodando] = useState(true);
    const [total_ciclos,setTotal_ciclos] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!rodando) return;

    intervalRef.current = setInterval(() => {
      setTempoRestante((atual) => {
        if (atual <= 1) {
          avancarCiclo();
          return atual; 
        }
        return atual - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [rodando, modo]);

  function avancarCiclo() {
    if (modo === "ativo") {
      if (cicloAtual >= total_ciclos) {
        setRodando(false);
        setTempoRestante(0);
        return;
      }
      setModo("pausa");
      setDuracaoTotal(PAUSA_MINUTOS * 60);
      setTempoRestante(PAUSA_MINUTOS * 60);
    } else {
      setCicloAtual((c) => c + 1);
      setModo("foco");
      setDuracaoTotal(FOCO_MINUTOS * 60);
      setTempoRestante(FOCO_MINUTOS * 60);
    }
  }

  function alternarPausa() {
    setRodando((r) => !r);
  }

  function cancelar() {
    setRodando(false);
    setModo("foco");
    setCicloAtual(1);
    setDuracaoTotal(FOCO_MINUTOS * 60);
    setTempoRestante(FOCO_MINUTOS * 60);
  }

  const getPomodoro = async ()=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pomodoro/`)
  }

  const progresso = useMemo(() => {
    const decorrido = duracaoTotal - tempoRestante;
    return Math.min(1, Math.max(0, decorrido / duracaoTotal));
  }, [duracaoTotal, tempoRestante]);

  const dashOffset = CIRCUNFERENCIA * (1 - progresso);

  const anguloRad = progresso * 2 * Math.PI - Math.PI / 2;
  const pontoX = 150 + RAIO * Math.cos(anguloRad);
  const pontoY = 150 + RAIO * Math.sin(anguloRad);

  const ciclosRestantes = TOTAL_CICLOS - cicloAtual + (modo === "pausa" ? 0 : 0);

  return (
    <div className={styles.page}>
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />
      <div className={`${styles.blob} ${styles.blob4}`} />

      <img src="/logoFocus.png" alt="Focus Flow" className={styles.logo} />

      <div className={styles.content}>
        <div className={`${styles.card} ${styles.main}`}>
          <div className={styles.header}>
            <div className={styles.headerTitleRow}>
              <Timer />
              <span className={styles.title}>Pomodoro</span>
            </div>
            <p className={styles.subtitle}>
              {modo === "foco" ? "Mantenha o foco e vá além." : "Aproveite a pausa, você merece."}
            </p>

            <span
              className={`${styles.cicloBadge} ${
                modo === "pausa" ? styles.cicloBadgePausa : ""
              }`}
            >
              <RefreshCw />
              Ciclo {cicloAtual} de {TOTAL_CICLOS}
              {ciclosRestantes > 0 && ` · ${ciclosRestantes} restante${ciclosRestantes > 1 ? "s" : ""}`}
            </span>
          </div>

          <div className={styles.timerWrapper}>
            <svg viewBox="0 0 300 300" className={styles.timerSvg}>
              <circle cx="150" cy="150" r={RAIO} className={styles.trackCircle} />
              <circle
                cx="150"
                cy="150"
                r={RAIO}
                className={`${styles.progressCircle} ${
                  modo === "pausa" ? styles.progressCirclePausa : ""
                }`}
                strokeDasharray={CIRCUNFERENCIA}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <svg
              viewBox="0 0 300 300"
              className={styles.timerSvg}
              style={{ transform: "none", position: "absolute", inset: 0 }}
            >
              <circle cx={pontoX} cy={pontoY} r={7} className={styles.progressDot} />
            </svg>

            <div className={styles.timerCenter}>
              <span className={styles.timerModo}>{modo === "foco" ? "Foco" : "Pausa"}</span>
              <span className={styles.timerValor}>{formatarTempo(tempoRestante)}</span>
              <span className={styles.timerTotal}>de {formatarTempo(duracaoTotal)}</span>
            </div>
          </div>

          <div className={styles.controlsRow}>
            <button className={styles.controlBtn} onClick={alternarPausa}>
              {rodando ? <Pause /> : <Play />}
              {rodando ? "Pausar" : "Retomar"}
            </button>
            <button className={styles.controlBtn} onClick={cancelar}>
              <X />
              Cancelar
            </button>
          </div>

          <div className={styles.dica}>
            <Sprout />
            Distrações não constroem o futuro.
          </div>
        </div>
      </div>
    </div>
  );
}