"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import "@excalidraw/excalidraw/index.css";
import styles from "./mindMap.module.css";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false },
);

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const DEBOUNCE_MS = 800;

interface MindMapDocument {
  elements: readonly ExcalidrawElement[];
  files: BinaryFiles;
  backgroundColor: string;
}

type TimerStatus = "idle" | "running" | "paused" | "finished";

interface TimerState {
  status: TimerStatus;
  acumulado: number; 
  inicio: number | null;
}

const TIMER_IDLE: TimerState = { status: "idle", acumulado: 0, inicio: null };

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function signature(
  elements: readonly ExcalidrawElement[],
  backgroundColor: string,
  files: BinaryFiles,
): string {
  return `${backgroundColor}|${Object.keys(files).length}|${elements
    .map((e) => `${e.id}:${e.version}`)
    .join(",")}`;
}

async function saveMindMap(mindMapId: string, doc: MindMapDocument): Promise<void> {
  const response = await fetch(`${API_URL}/api/mapa_mental/${mindMapId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      elements: doc.elements,
      files: doc.files,
      background_color: doc.backgroundColor,
    }),
  });
  if (!response.ok) {
    throw new Error(`Falha ao salvar o mind map (status ${response.status})`);
  }
}

async function loadMindMap(mindMapId: string): Promise<MindMapDocument | null> {
  const response = await fetch(`${API_URL}/api/mapa_mental/${mindMapId}`);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Falha ao carregar o mind map (status ${response.status})`);
  }
  const data = await response.json();
  return {
    elements: data.elements ?? [],
    files: data.files ?? {},
    backgroundColor: data.background_color ?? "#ffffff",
  };
}

async function saveTime(mindMapId: string, segundos: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/mapa_mental/${mindMapId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ segundos }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `Falha ao registrar o tempo (status ${response.status})`);
  }
}

interface MindMapProps {
  mindMapId: string;
  onFinish?: (elapsedSeconds: number) => void;
}

export default function MindMap({ mindMapId, onFinish }: MindMapProps) {
  const [initialData, setInitialData] = useState<MindMapDocument | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [timer, setTimer] = useState<TimerState>(TIMER_IDLE);
  const [timerHydrated, setTimerHydrated] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const timerKey = `mindmap-timer-${mindMapId}`;

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDoc = useRef<MindMapDocument | null>(null);
  const lastSignature = useRef<string | null>(null);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(timerKey);
      if (salvo) setTimer(JSON.parse(salvo) as TimerState);
    } catch {}
    setTimerHydrated(true);
  }, [timerKey]);

  useEffect(() => {
    if (!timerHydrated) return;
    try {
      if (timer.status === "idle" || timer.status === "finished") {
        localStorage.removeItem(timerKey);
      } else {
        localStorage.setItem(timerKey, JSON.stringify(timer));
      }
    } catch {}
  }, [timer, timerHydrated, timerKey]);

  useEffect(() => {
    if (timer.status !== "running") return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [timer.status]);

  const elapsedMs =
    timer.acumulado +
    (timer.status === "running" && timer.inicio ? now - timer.inicio : 0);
  const elapsed = Math.floor(elapsedMs / 1000);

  const handleStartPause = () => {
    if (timer.status === "running") {
      setTimer((t) => ({
        status: "paused",
        acumulado: t.acumulado + (Date.now() - (t.inicio ?? Date.now())),
        inicio: null,
      }));
    } else {
      setNow(Date.now());
      setTimer((t) => ({ status: "running", acumulado: t.acumulado, inicio: Date.now() }));
    }
  };

  const handleFinish = async () => {
  const total =
    timer.acumulado +
    (timer.status === "running" && timer.inicio ? Date.now() - timer.inicio : 0);
  const seconds = Math.floor(total / 1000);

  try {
    await saveTime(mindMapId, seconds);
    setTimer({ status: "finished", acumulado: total, inicio: null });
    setErrorMessage(null);
    onFinish?.(seconds);
  } catch (err) {
    // pausa em vez de finalizar, para o usuário poder tentar de novo
    setTimer({ status: "paused", acumulado: total, inicio: null });
    setStatus("error");
    setErrorMessage(err instanceof Error ? err.message : "Erro ao registrar o tempo");
  }
};

  const handleReset = () => setTimer(TIMER_IDLE);

  useEffect(() => {
    let cancelled = false;

    loadMindMap(mindMapId)
      .then((doc) => {
        if (cancelled) return;
        const data: MindMapDocument =
          doc ?? { elements: [], files: {}, backgroundColor: "#ffffff" };
        // Assinatura inicial: evita salvar de novo o que acabou de ser carregado
        lastSignature.current = signature(data.elements, data.backgroundColor, data.files);
        setInitialData(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Erro ao carregar o mind map");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mindMapId]);

  // ---------- autosave ----------
  const flush = useCallback(async () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    const doc = pendingDoc.current;
    if (!doc) return;
    pendingDoc.current = null;

    try {
      await saveMindMap(mindMapId, doc);
      lastSignature.current = signature(doc.elements, doc.backgroundColor, doc.files);
      setStatus("saved");
      setErrorMessage(null);
    } catch (err) {
      pendingDoc.current ??= doc; // mantém para tentar de novo na próxima mudança
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Erro ao salvar o mind map");
    }
  }, [mindMapId]);

  const handleChange = useCallback(
    (elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
      const sig = signature(elements, appState.viewBackgroundColor, files);
      if (sig === lastSignature.current) return; // nada mudou de verdade

      pendingDoc.current = {
        elements,
        files,
        backgroundColor: appState.viewBackgroundColor,
      };
      setStatus("saving");

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(flush, DEBOUNCE_MS);
    },
    [flush],
  );

  // Salva imediatamente ao esconder a aba ou sair da tela
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") void flush();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      void flush();
    };
  }, [flush]);

  // ---------- render ----------
  const statusClass =
    status === "saving"
      ? styles.statusSaving
      : status === "saved"
        ? styles.statusSaved
        : status === "error"
          ? styles.statusError
          : "";

  const isRunning = timer.status === "running";
  const isFinished = timer.status === "finished";

  return (
    <div className={styles.wrapper}>
      <div className={styles.blobTopRight} />
      <div className={styles.blobTopRightSmall} />
      <div className={styles.blobBottomLeft} />
      <div className={styles.blobBottomLeftSmall} />

      <div className={styles.topBar}>
        <div
          className={`${styles.timer} ${isRunning ? styles.timerRunning : ""} ${
            isFinished ? styles.timerFinished : ""
          }`}
        >
          <span className={styles.timerDot} />
          <span className={styles.timerDisplay}>{formatTime(elapsed)}</span>

          {!isFinished ? (
            <>
              <button
                type="button"
                className={styles.timerBtn}
                onClick={handleStartPause}
                aria-label={isRunning ? "Pausar" : "Iniciar"}
                title={isRunning ? "Pausar" : "Iniciar"}
              >
                {isRunning ? "⏸" : "▶"}
              </button>
              <button
                type="button"
                className={`${styles.timerBtn} ${styles.timerBtnFinish}`}
                onClick={handleFinish}
                disabled={timer.status === "idle"}
                aria-label="Concluir"
                title="Concluir"
              >
                ✓ Concluir
              </button>
            </>
          ) : (
            <>
              <span className={styles.timerLabel}>Concluído</span>
              <button
                type="button"
                className={styles.timerBtn}
                onClick={handleReset}
                aria-label="Reiniciar"
                title="Reiniciar"
              >
                ↺
              </button>
            </>
          )}
        </div>

        <div className={`${styles.statusBadge} ${statusClass}`}>
          <span className={styles.statusDot} />
          {status === "saving" && "Salvando…"}
          {status === "saved" && "Salvo"}
          {status === "error" && "Erro ao salvar"}
          {status === "idle" && "Pronto"}
        </div>
      </div>

      <div className={styles.canvasCard}>
        {initialData && (
          <Excalidraw
            initialData={{
              elements: initialData.elements,
              files: initialData.files,
              appState: { viewBackgroundColor: initialData.backgroundColor },
            }}
            onChange={handleChange}
          />
        )}
      </div>

      {status === "error" && errorMessage && (
        <div className={styles.erro}>{errorMessage}</div>
      )}
    </div>
  );
}