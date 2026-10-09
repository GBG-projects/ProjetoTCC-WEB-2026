"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../material/Materiais.module.css";

const API = process.env.NEXT_PUBLIC_API_URL;

type Prova = {
  id: number;
  titulo: string;
  pdf_url: string | null;
  preview_url: string | null;
  criado_em: string;
};

export default function ProvasPage() {
  const router = useRouter();
  const [provas, setProvas] = useState<Prova[]>([]);
  const [selecionadoId, setSelecionadoId] = useState<number | null>(null);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const gerando = useRef<Set<number>>(new Set());

  useEffect(() => {
    fetch(`${API}/api/prova`)
      .then((r) => {
        if (!r.ok) throw new Error("Falha ao buscar provas");
        return r.json();
      })
      .then((data: Prova[]) => {
        setProvas(data);
        setSelecionadoId(data[0]?.id ?? null);
      })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    const pendentes = provas.filter(
      (p) => !p.preview_url && p.pdf_url && !gerando.current.has(p.id)
    );
    if (pendentes.length === 0) return;

    pendentes.forEach((p) => gerando.current.add(p.id));

    let cancelado = false;
    (async () => {
      for (const prova of pendentes) {
        if (cancelado) return;
        try {
          const r = await fetch(`${API}/api/prova/${prova.id}/capa`, { method: "POST" });
          if (!r.ok) throw new Error();
          const { preview_url } = await r.json();
          setProvas((atual) =>
            atual.map((p) => (p.id === prova.id ? { ...p, preview_url } : p))
          );
        } catch {
          gerando.current.delete(prova.id);
        }
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [provas]);

  const filtradas = useMemo(
    () => provas.filter((p) => p.titulo.toLowerCase().includes(busca.toLowerCase())),
    [provas, busca]
  );

  const selecionada = provas.find((p) => p.id === selecionadoId) ?? null;

  if (carregando) return <p className={styles.vazio}>Carregando…</p>;
  if (erro) return <p className={styles.erro}>{erro}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.blobTopRight} />
      <div className={styles.blobBottomLeft} />

      <div className={styles.layout}>
        <section className={styles.listSection}>
          <div className={styles.listHeader}>
            <h2>Provas</h2>
            <p>Pratique com provas anteriores e confira o gabarito</p>
            <input
              className={styles.search}
              placeholder="Pesquisar"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className={styles.listScroll}>
            {filtradas.length === 0 && (
              <p className={styles.vazio}>Nenhuma prova encontrada.</p>
            )}
            {filtradas.map((prova) => (
              <button
                key={prova.id}
                className={`${styles.livroItem} ${
                  prova.id === selecionadoId ? styles.livroAtivo : ""
                }`}
                onClick={() => setSelecionadoId(prova.id)}
              >
                <span className={styles.livroTitulo}>{prova.titulo}</span>
                <span className={styles.chevron}>›</span>
              </button>
            ))}
          </div>
        </section>

        {selecionada && (
          <aside className={styles.detalhes}>
            {selecionada.preview_url ? (
              <img
                src={selecionada.preview_url}
                alt={`Capa de ${selecionada.titulo}`}
                className={styles.capa}
              />
            ) : (
              <div className={styles.capa} />
            )}

            <div className={styles.info}>
              <h3>{selecionada.titulo}</h3>
              <p>
                <strong>Criada em:</strong>{" "}
                {new Date(selecionada.criado_em).toLocaleDateString("pt-BR")}
              </p>
              <div className={styles.divider} />
            </div>

            <button
              className={styles.btnIniciar}
              onClick={() => router.push(`/test/${selecionada.id}/ler`)}
            >
              ▷ Iniciar
            </button>
          </aside>
        )}
      </div>
    </div>
  );
}