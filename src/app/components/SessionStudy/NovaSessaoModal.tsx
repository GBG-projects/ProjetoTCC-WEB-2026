"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./NovaSessaoModal.module.css";


type NovaSessaoModal={
  aberto:boolean;
  disciplinas:Disciplina[];
  criando:boolean;
  onFechar:()=> void;
  onCriar: (dados: { disciplina_id: number; tipo: string }) => void;
}

interface Disciplina {
  nome: string;
  id: number;
}

export default function NovaSessaoModal({
  aberto,
  disciplinas,
  criando,
  onFechar,
  onCriar,
}:NovaSessaoModal
) {
  const [disciplinaId, setDisciplinaId] = useState("");
  const [tipo, setTipo] = useState("");

  useEffect(() => {
    if (aberto) {
      setDisciplinaId("");
      setTipo("");
    }
  }, [aberto]);

  if (!aberto) return null;

  function handleSubmit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!disciplinaId || !tipo.trim()) return;

      onCriar({
        disciplina_id: Number(disciplinaId),
        tipo: tipo.trim(),
      });
    }

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.titulo}>Nova Sessão de Estudo</h3>
            <p className={styles.subtitulo}>
              Preencha as informações para começar a estudar!
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className={styles.btnSair}
            disabled={criando}
          >
            ← Sair
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.card}>
            <span className={styles.cardLabel}>Informações da sessão</span>

            <label className={styles.label}>
              Disciplina
              <select
                value={disciplinaId}
                onChange={(e) => setDisciplinaId(e.target.value)}
                className={styles.select}
                required
              >
                <option value="" disabled>
                  Selecione uma disciplina
                </option>
                {disciplinas.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Tipo
              <input
                type="text"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                placeholder="Ex: Revisão para prova, Leitura de capítulo..."
                maxLength={50}
                className={styles.input}
                required
              />
            </label>
          </div>

          <div className={styles.acoes}>
            <button
              type="button"
              onClick={onFechar}
              className={styles.btnCancelar}
              disabled={criando}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.btnCriar} disabled={criando}>
              {criando ? "Criando..." : "Criar Sessão"}
            </button>
          </div>

          <p className={styles.rodape}>
            Continue focando. Você está no caminho certo!
          </p>
        </form>
      </div>
    </div>
  );
}