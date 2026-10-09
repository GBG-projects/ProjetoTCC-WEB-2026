"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Materiais.module.css";

const API = process.env.NEXT_PUBLIC_API_URL;

type Livro = {
  id: number;
  titulo: string;
  autor: string | null;
  editora: string | null;
  sinopse: string | null;
  pdf_url: string | null;
  preview_url: string | null;
};

export default function MateriaisPage() {
  const router = useRouter();
  const [livros, setLivros] = useState<Livro[]>([]);
  const [selecionadoId, setSelecionadoId] = useState<number | null>(null);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const gerando = useRef<Set<number>>(new Set());

  useEffect(() => {
    fetch(`${API}/api/livro`)
      .then((r) => {
        if (!r.ok) throw new Error("Falha ao buscar livros");
        return r.json();
      })
      .then((data: Livro[]) => {
        setLivros(data);
        console.log("carregou")
        setSelecionadoId(data[0]?.id ?? null);
      })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    const pendentes = livros.filter(
      (l) => !l.preview_url && l.pdf_url && !gerando.current.has(l.id)
    );
    if (pendentes.length === 0) return;

    pendentes.forEach((l) => gerando.current.add(l.id));

    let cancelado = false;
    (async () => {
      for (const livro of pendentes) {
        if (cancelado) return;
        try {
          const r = await fetch(`${API}/api/livro/${livro.id}/capa`, { method: "POST" });
          if (!r.ok) throw new Error();
          const { preview_url } = await r.json();
          setLivros((atual) =>
            atual.map((l) => (l.id === livro.id ? { ...l, preview_url } : l))
          );
          console.log("gerou capa")
        } catch {
          gerando.current.delete(livro.id);
        }
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [livros]);

  const filtrados = useMemo(
    () => livros.filter((l) => l.titulo.toLowerCase().includes(busca.toLowerCase())),
    [livros, busca]
  );

  const selecionado = livros.find((l) => l.id === selecionadoId) ?? null;

  if (carregando) return <p className={styles.vazio}>Carregando…</p>;
  if (erro) return <p className={styles.erro}>{erro}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.blobTopRight} />
      <div className={styles.blobBottomLeft} />

      <div className={styles.layout}>
        {/* <Sidebar /> */}

        <section className={styles.listSection}>
          <div className={styles.listHeader}>
            <h2>Materiais</h2>
            <p>Utilize nossa biblioteca para melhorar o seu desempenho</p>
            <input
              className={styles.search}
              placeholder="Pesquisar"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className={styles.listScroll}>
            {filtrados.length === 0 && (
              <p className={styles.vazio}>Nenhum material encontrado.</p>
            )}
            {filtrados.map((livro) => (
              <button
                key={livro.id}
                className={`${styles.livroItem} ${
                  livro.id === selecionadoId ? styles.livroAtivo : ""
                }`}
                onClick={() => setSelecionadoId(livro.id)}
              >
                <span className={styles.livroTitulo}>{livro.titulo}</span>
                <span className={styles.chevron}>›</span>
              </button>
            ))}
          </div>
        </section>

        {selecionado && (
          <aside className={styles.detalhes}>
            {selecionado.preview_url ? (
              <img
                src={selecionado.preview_url}
                alt={`Capa de ${selecionado.titulo}`}
                className={styles.capa}
              />
            ) : (
              <div className={styles.capa} />
            )}

            <div className={styles.info}>
              <h3>{selecionado.titulo}</h3>
              <p><strong>Autor:</strong> {selecionado.autor ?? "—"}</p>
              <p><strong>Editora:</strong> {selecionado.editora ?? "—"}</p>
              <div className={styles.divider} />
            </div>

              <h4>Sinopse</h4>  
            <p className={styles.sinopse}>{selecionado.sinopse ?? "Sem sinopse."}</p>

            <button
              className={styles.btnIniciar}
              onClick={() => router.push(`/material/${selecionado.id}/ler`)}
            >
              ▷ Iniciar
            </button>
          </aside>
        )}
      </div>
    </div>
  );
}