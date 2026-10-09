"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ArrowLeft, Pause, Play, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./SessaoFlashcard.module.css";

interface Flashcard {
  id: number;
  pergunta: string;
  resposta: string;
  deck_id: number;
  sessao_id: number | null;
  criado_em: string;
}

type DeckStatus = "carregando" | "ativo" | "pausado" | "concluido";

interface SessaoFlashCardsProps {
  deckId: string;
  // Estado inicial vindo do lugar onde o deck foi listado (ex: GET do deck),
  // já que a rota /iniciar não retorna tempo_gasto acumulado de sessões anteriores.
  tempoGastoInicial?: number; // em segundos
  onVoltar?: () => void;
  onConcluido?: () => void;
}

const API = process.env.NEXT_PUBLIC_API_URL;

// Ajuste aqui se os paths reais forem diferentes
const rotaIniciar = (id: string) => `${API}/api/flashcard_deck/${id}/iniciar`;
const rotaPausar = (id: string) => `${API}/api/flashcard_deck/${id}/pausar`;
const rotaConcluir = (id: string) => `${API}/api/flashcard_deck/${id}/concluir`;
const rotaListar = (id: string) => `${API}/api/flashcard_deck/${id}/flashcard`;

function formatarTempo(totalSegundos: number) {
  const s = Math.max(0, Math.floor(totalSegundos));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

export default function SessaoFlashCards({
  deckId,
  tempoGastoInicial = 0,
  onVoltar,
  onConcluido,
}: SessaoFlashCardsProps) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [carregandoCards, setCarregandoCards] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [status, setStatus] = useState<DeckStatus>("carregando");
  const [tempoGasto, setTempoGasto] = useState(tempoGastoInicial); // acumulado, autoritativo do servidor
  const [iniciadoEm, setIniciadoEm] = useState<string | null>(null); // ISO timestamp do período ativo atual
  const [tempoExibido, setTempoExibido] = useState(tempoGastoInicial);

  const [indiceAtual, setIndiceAtual] = useState(0);
  const [virado, setVirado] = useState(false);

  const acaoEmAndamento = useRef(false);

  // Busca os cards do deck
  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        setCarregandoCards(true);
        const res = await fetch(rotaListar(deckId));
        if (!res.ok) throw new Error("Falha ao carregar flash cards");
        const data = await res.json();
        if (ativo) setCards(data);
      } catch (err) {
        if (ativo) setErro(err instanceof Error ? err.message : "Erro ao carregar cards");
      } finally {
        if (ativo) setCarregandoCards(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [deckId]);

  // Inicia a sessão automaticamente ao entrar na tela
  useEffect(() => {
    handleIniciar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId]);

  // Relógio: atualiza a cada segundo enquanto ativo
  useEffect(() => {
    if (status !== "ativo" || !iniciadoEm) {
      setTempoExibido(tempoGasto);
      return;
    }
    const inicio = new Date(iniciadoEm).getTime();
    const tick = () => {
      const decorrido = (Date.now() - inicio) / 1000;
      setTempoExibido(tempoGasto + decorrido);
    };
    tick();
    const intervalo = setInterval(tick, 1000);
    return () => clearInterval(intervalo);
  }, [status, iniciadoEm, tempoGasto]);

  const handleIniciar = useCallback(async () => {
    if (acaoEmAndamento.current) return;
    acaoEmAndamento.current = true;
    try {
      const res = await fetch(rotaIniciar(deckId), { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message ?? "Falha ao iniciar");
      setStatus("ativo");
      setIniciadoEm(data.deck.iniciado_em);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao iniciar sessão");
      setStatus("pausado");
    } finally {
      acaoEmAndamento.current = false;
    }
  }, [deckId]);

  const handlePausar = useCallback(async () => {
    if (acaoEmAndamento.current) return;
    acaoEmAndamento.current = true;
    try {
      const res = await fetch(rotaPausar(deckId), { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message ?? "Falha ao pausar");
      setStatus("pausado");
      setTempoGasto(data.deck.tempo_gasto);
      setIniciadoEm(null);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao pausar sessão");
    } finally {
      acaoEmAndamento.current = false;
    }
  }, [deckId]);

  const handleConcluir = useCallback(async () => {
    if (acaoEmAndamento.current) return;
    acaoEmAndamento.current = true;
    try {
      const res = await fetch(rotaConcluir(deckId), { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message ?? "Falha ao concluir");
      setStatus("concluido");
      setTempoGasto(data.deck.tempo_gasto);
      setIniciadoEm(null);
      onConcluido?.();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao concluir sessão");
    } finally {
      acaoEmAndamento.current = false;
    }
  }, [deckId, onConcluido]);

  const irParaProximo = () => {
    setVirado(false);
    setIndiceAtual((i) => Math.min(i + 1, cards.length - 1));
  };

  const irParaAnterior = () => {
    setVirado(false);
    setIndiceAtual((i) => Math.max(i - 1, 0));
  };

  const cardAtual = cards[indiceAtual];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.btnGhost} onClick={onVoltar} type="button">
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div className={styles.relogio} aria-live="polite">
          <span className={styles.relogioDigitos}>{formatarTempo(tempoExibido)}</span>
          <span className={styles.relogioStatus} data-status={status}>
            {status === "ativo" && "estudando"}
            {status === "pausado" && "pausado"}
            {status === "concluido" && "concluído"}
            {status === "carregando" && "carregando"}
          </span>
        </div>

        {status === "ativo" ? (
          <button className={styles.btnControle} onClick={handlePausar} type="button">
            <Pause size={16} />
            Pausar
          </button>
        ) : status === "pausado" ? (
          <button className={styles.btnControle} onClick={handleIniciar} type="button">
            <Play size={16} />
            Retomar
          </button>
        ) : (
          <div style={{ width: 96 }} />
        )}
      </header>

      {erro && <div className={styles.erro}>{erro}</div>}

      {carregandoCards ? (
        <p className={styles.vazio}>Carregando cards...</p>
      ) : cards.length === 0 ? (
        <p className={styles.vazio}>Este deck não tem flash cards ainda.</p>
      ) : status === "concluido" ? (
        <div className={styles.telaFinal}>
          <CheckCircle2 size={48} strokeWidth={1.5} />
          <h2>Sessão concluída</h2>
          <p>Tempo total: {formatarTempo(tempoGasto)}</p>
        </div>
      ) : (
        <>
          <div className={styles.progresso}>
            {indiceAtual + 1} / {cards.length}
          </div>

          <div className={styles.palco}>
            <button
              className={styles.navBtn}
              onClick={irParaAnterior}
              disabled={indiceAtual === 0}
              type="button"
              aria-label="Card anterior"
            >
              <ChevronLeft size={22} />
            </button>

            <div
              className={styles.cardFlipWrapper}
              onClick={() => setVirado((v) => !v)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setVirado((v) => !v)}
              aria-label="Clique para virar o card"
            >
              <div className={`${styles.cardFlipInner} ${virado ? styles.cardVirado : ""}`}>
                <div className={styles.cardFace}>
                  <span className={styles.cardRotulo}>pergunta</span>
                  <p className={styles.cardTexto}>{cardAtual?.pergunta}</p>
                  <span className={styles.dica}>toque para ver a resposta</span>
                </div>
                <div className={`${styles.cardFace} ${styles.cardVerso}`}>
                  <span className={styles.cardRotulo}>resposta</span>
                  <p className={styles.cardTexto}>{cardAtual?.resposta}</p>
                </div>
              </div>
            </div>

            <button
              className={styles.navBtn}
              onClick={irParaProximo}
              disabled={indiceAtual === cards.length - 1}
              type="button"
              aria-label="Próximo card"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <button className={styles.btnConcluir} onClick={handleConcluir} type="button">
            <CheckCircle2 size={18} />
            Concluir sessão
          </button>
        </>
      )}
    </div>
  );
}