"use client";

import styles from "@/app/(private)/sessions-study/SessionStudy.module.css";

import { ArrowLeft, Check } from "lucide-react";

import MetodoCard from "./MetodoCard";

import {
  PomodoroForm,
  MapaMentalForm,
  LivreForm,
  FlashcardForm,
} from "./forms";

export default function NovaSessaoForm({
  METODOS,

  titulo,
  setTitulo,

  metodoSelecionado,
  setMetodoSelecionado,

  onCancelar,
  onSubmit,

  pomodoro,
  setPomodoro,

  mapaMental,
  setMapaMental,
  criandoSessao,
  estudoLivre,
  setEstudoLivre,
}) {
  return (
    <form
      className={styles.novaSessaoView}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <div className={styles.headerRow}>
        <h2 className={styles.title}>
          Adicionar método de Estudo na sua sessão
        </h2>

        <button type="button" className={styles.sairBtn} onClick={onCancelar}>
          <ArrowLeft />
          Sair
        </button>
      </div>

      <p className={styles.subtitle}>
        Utilize ferramentas eficientes para maximizar o seu desempenho!
      </p>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Escolha o Método de Estudo</p>

        <div className={styles.metodoGrid}>
          {METODOS.map((metodo) => (
            <MetodoCard
              key={metodo.id}
              metodo={metodo}
              selecionado={metodoSelecionado === metodo.id}
              onSelect={setMetodoSelecionado}
            />
          ))}
        </div>

        {metodoSelecionado && (
          <section className={styles.section} style={{ marginTop: "1.5rem" }}>
            <p className={styles.sectionLabel}>Informações da método</p>

            <div className={styles.inputGroup}>
              <label>Título da Sessão</label>

              <input
                className={styles.input}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex.: Revisão de Matemática"
              />
            </div>

            {metodoSelecionado === "pomodoro" && (
              <PomodoroForm dados={pomodoro} setDados={setPomodoro} />
            )}

            {metodoSelecionado === "mapa_mental" && (
              <MapaMentalForm dados={mapaMental} setDados={setMapaMental} />
            )}

            {metodoSelecionado === "livre" && (
              <LivreForm dados={estudoLivre} setDados={setEstudoLivre} />
            )}

            {metodoSelecionado === "flashcard" && <FlashcardForm />}

            <button
              type="submit"
              disabled={criandoSessao}
              className={styles.primaryButton}
            >
              {criandoSessao ? "Criando..." : "Criar Método"}
            </button>
          </section>
        )}
      </section>

      <p className={styles.footerTexto}>
        Continue focando. Você está no caminho certo!
      </p>
    </form>
  );
}
