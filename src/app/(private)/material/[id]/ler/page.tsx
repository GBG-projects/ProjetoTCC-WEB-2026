"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./Leitor.module.css";

const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => <p className={styles.vazio}>Carregando leitor…</p>,
});

type Livro = { id: number; titulo: string; autor: string | null; pdf_url: string | null };

export default function LeitorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [livro, setLivro] = useState<Livro | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/livro/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 404 ? "Livro não encontrado" : "Falha ao buscar livro");
        return r.json();
      })
      .then(setLivro)
      .catch((e) => setErro(e.message));
  }, [id]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <button className={styles.btnGhost} onClick={() => router.push("/material")}>
            ← Voltar
          </button>
          <div className={styles.headerTitle}>
            <h1>{livro?.titulo ?? "Carregando…"}</h1>
            {livro?.autor && <p>{livro.autor}</p>}
          </div>
          <div className={styles.headerSpacer} />
        </header>

        {erro && <p className={styles.erro}>{erro}</p>}
        {livro?.pdf_url && <PdfViewer url={livro.pdf_url} />}
        {livro && !livro.pdf_url && <p className={styles.erro}>Este livro não tem PDF.</p>}
      </div>
    </div>
  );
}