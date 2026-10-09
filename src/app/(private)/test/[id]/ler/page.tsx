"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./Leitor.module.css";

const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => <p className={styles.vazio}>Carregando leitor…</p>,
});

type Prova = {
  id: number;
  titulo: string;
  pdf_url: string | null;
  gabarito_url: string | null;
};

type Aba = "prova" | "gabarito";

export default function LeitorProvaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [prova, setProva] = useState<Prova | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [aba, setAba] = useState<Aba>("prova");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prova/${id}`)
      .then((r) => {
        if (!r.ok)
          throw new Error(r.status === 404 ? "Prova não encontrada" : "Falha ao buscar prova");
        return r.json();
      })
      .then(setProva)
      .catch((e) => setErro(e.message));
  }, [id]);

  const urlAtual = prova ? (aba === "prova" ? prova.pdf_url : prova.gabarito_url) : null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <button className={styles.btnGhost} onClick={() => router.push("/test")}>
            ← Voltar
          </button>
          <div className={styles.headerTitle}>
            <h1>{prova?.titulo ?? "Carregando…"}</h1>
          </div>
          <div className={styles.headerSpacer} />
        </header>

        {prova && (
          <div className={styles.tabs} role="tablist">
            <button
              role="tab"
              aria-selected={aba === "prova"}
              className={`${styles.tab} ${aba === "prova" ? styles.tabAtiva : ""}`}
              onClick={() => setAba("prova")}
            >
              Prova
            </button>
            <button
              role="tab"
              aria-selected={aba === "gabarito"}
              className={`${styles.tab} ${aba === "gabarito" ? styles.tabAtiva : ""}`}
              onClick={() => setAba("gabarito")}
            >
              Gabarito
            </button>
          </div>
        )}

        {erro && <p className={styles.erro}>{erro}</p>}

        {prova && urlAtual && <PdfViewer key={urlAtual} url={urlAtual} />}
        {prova && !urlAtual && (
          <p className={styles.erro}>
            {aba === "prova" ? "Esta prova não tem PDF." : "Esta prova não tem gabarito."}
          </p>
        )}
      </div>
    </div>
  );
}