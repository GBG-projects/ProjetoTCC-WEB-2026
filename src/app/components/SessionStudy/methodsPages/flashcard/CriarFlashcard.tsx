"use client";

import { useEffect, useState, useCallback } from "react";
import { Pencil, Trash2, Plus, ArrowLeft, Play } from "lucide-react";
import styles from "./flashcard.module.css";
import SessaoFlashCards from "./SessaoFlashcard"; // ajuste o caminho se o arquivo estiver em outra pasta

interface Flashcard {
  id: number;
  pergunta: string;
  resposta: string;
  deck_id: number;
  sessao_id: number | null;
  criado_em: string;
}

interface CriarFlashCardsProps {
  flashcard_id: string;
  onVoltar?: () => void;
  onIniciar?: (deckId: string) => void;
}

const MAX_LENGTH = 500;

export default function CriarFlashCards({
  flashcard_id,
  onVoltar,
  onIniciar,
}: CriarFlashCardsProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // NOVO: controla se está no formulário de criação/edição ou na sessão de estudo
  const [modo, setModo] = useState<"criar" | "sessao">("criar");

  const fetchFlashcards = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/flashcard_deck/${flashcard_id}/flashcard`);
      if (!res.ok) throw new Error("Falha ao carregar flash cards");
      const data = await res.json();
      setFlashcards(data);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [flashcard_id]);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  const limparForm = () => {
    setPergunta("");
    setResposta("");
    setEditingId(null);
  };

  const handleEditar = (card: Flashcard) => {
    setEditingId(card.id);
    setPergunta(card.pergunta);
    setResposta(card.resposta);
  };

  const handleExcluir = async (id: number) => {
    const anterior = flashcards;
    setFlashcards((prev) => prev.filter((c) => c.id !== id));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/flashcard/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao excluir");
      if (editingId === id) limparForm();
    } catch (err) {
      setFlashcards(anterior);
      setErro(err instanceof Error ? err.message : "Erro ao excluir");
    }
  };

  const handleSalvar = async () => {
    if (!pergunta.trim() || !resposta.trim()) return;
    setSalvando(true);
    setErro(null);
    try {
      if (editingId) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/flashcard/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pergunta, resposta }),
        });
        if (!res.ok) throw new Error("Falha ao atualizar flash card");
        const { flashcard: atualizado } = await res.json();
        setFlashcards((prev) =>
          prev.map((c) => (c.id === editingId ? atualizado : c))
        );
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/flashcard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deck_id: flashcard_id, pergunta, resposta }),
        });
        if (!res.ok) throw new Error("Falha ao criar flash card");
        const { flashcard: novo } = await res.json();
        setFlashcards((prev) => [novo, ...prev]);
      }
      limparForm();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSalvando(false);
    }
  };

  // NOVO: quando em modo "sessao", renderiza SessaoFlashCards em vez do formulário
  if (modo === "sessao") {
    return (
      <SessaoFlashCards
        deckId={flashcard_id}
        onVoltar={() => setModo("criar")}
        onConcluido={() => setModo("criar")}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.blobTopRight} />
      <div className={styles.blobTopRightSmall} />
      <div className={styles.blobBottomLeft} />
      <div className={styles.blobBottomLeftSmall} />

      <div className={styles.card}>
        <header className={styles.header}>
          <button className={styles.btnGhost} onClick={onVoltar} type="button">
            <ArrowLeft size={18} />
            Voltar
          </button>

          <div className={styles.headerTitle}>
            <h1>Criar Flash Cards</h1>
            <p>Crie seus cards e organize seus estudos !</p>
          </div>

          <button
            className={styles.btnGhost}
            onClick={() => {
              setModo("sessao");        // ALTERADO: agora troca de tela de verdade
              onIniciar?.(flashcard_id); // mantido para compatibilidade, caso o pai queira ouvir esse evento
            }}
            type="button"
            disabled={flashcards.length === 0}
          >
            <Play size={16} />
            Iniciar
          </button>
        </header>

        {erro && <div className={styles.erro}>{erro}</div>}

        <div className={styles.content}>
          <section className={styles.formSection}>
            <div className={styles.field}>
              <label className={styles.label}>
                <Pencil size={16} />
                Pergunta
              </label>
              <textarea
                className={styles.textarea}
                placeholder="Digite a sua pergunta"
                value={pergunta}
                maxLength={MAX_LENGTH}
                onChange={(e) => setPergunta(e.target.value)}
              />
              <span className={styles.counter}>
                {pergunta.length}/{MAX_LENGTH}
              </span>
            </div>

            <div className={styles.divider} />

            <div className={styles.field}>
              <label className={styles.label}>
                <Pencil size={16} />
                Resposta
              </label>
              <textarea
                className={styles.textarea}
                placeholder="Digite a sua resposta"
                value={resposta}
                maxLength={MAX_LENGTH}
                onChange={(e) => setResposta(e.target.value)}
              />
              <span className={styles.counter}>
                {resposta.length}/{MAX_LENGTH}
              </span>
            </div>

            <button
              className={styles.btnCriar}
              onClick={handleSalvar}
              disabled={salvando || !pergunta.trim() || !resposta.trim()}
              type="button"
            >
              {editingId ? "Salvar Alterações" : "Criar Novo Flash Card"}
              <Plus size={18} />
            </button>

            {editingId && (
              <button
                className={styles.btnCancelar}
                onClick={limparForm}
                type="button"
              >
                Cancelar edição
              </button>
            )}
          </section>

          <section className={styles.listSection}>
            <div className={styles.listHeader}>
              <h2>Seus Flash Cards</h2>
              <p>Grencie seus cards criados</p>
            </div>

            <div className={styles.listScroll}>
              {loading ? (
                <p className={styles.vazio}>Carregando...</p>
              ) : flashcards.length === 0 ? (
                <p className={styles.vazio}>
                  Nenhum flash card criado ainda.
                </p>
              ) : (
                flashcards.map((card, i) => (
                  <div key={card.id} className={styles.flashcardItem}>
                    <div className={styles.flashcardText}>
                      <p className={styles.flashcardPergunta}>
                        {i + 1}. {card.pergunta}
                      </p>
                      <p className={styles.flashcardResposta}>
                        {card.resposta}
                      </p>
                    </div>
                    <div className={styles.flashcardActions}>
                      <button
                        className={styles.iconBtn}
                        onClick={() => handleEditar(card)}
                        type="button"
                        aria-label="Editar flash card"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className={styles.iconBtnDanger}
                        onClick={() => handleExcluir(card.id)}
                        type="button"
                        aria-label="Excluir flash card"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}