"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import styles from "./Leitor.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

function PaginaLazy({ numero, largura }: { numero: number; largura: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);
  const [altura, setAltura] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), {
      rootMargin: "800px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={styles.pagina}
      style={{ width: largura, minHeight: altura ?? largura * 1.414 }}
    >
      {visivel && (
        <Page
          pageNumber={numero}
          width={largura}
          loading=""
          onRenderSuccess={(p) => setAltura(p.height)}
        />
      )}
    </div>
  );
}

export default function PdfViewer({ url }: { url: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [largura, setLargura] = useState(800);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setLargura(Math.max(280, Math.min(Math.floor(e.contentRect.width) - 32, 1000)))
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={styles.viewer}>
      <Document
        file={url}
        className={styles.documento}
        onLoadSuccess={({ numPages }) => setTotal(numPages)}
        loading={<p className={styles.vazio}>Carregando PDF…</p>}
        error={<p className={styles.erro}>Não foi possível abrir o PDF.</p>}
      >
        {Array.from({ length: total }, (_, i) => (
          <PaginaLazy key={i + 1} numero={i + 1} largura={largura} />
        ))}
      </Document>
    </div>
  );
}