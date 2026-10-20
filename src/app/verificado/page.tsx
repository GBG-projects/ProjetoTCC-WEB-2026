'use client'
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./verificado.module.css";

const SEGUNDOS = 5;

const MENSAGENS: Record<string, string> = {
  token: "Link de verificação incompleto.",
  invalido: "Link inválido ou já utilizado. Se sua conta já foi confirmada, faça login.",
  servidor: "Não foi possível verificar agora. Tente novamente em instantes.",
};

function Sucesso() {
  const router = useRouter();
  const [restante, setRestante] = useState(SEGUNDOS);

  useEffect(() => {
    if (restante <= 0) {
      router.replace("/signin");
      return;
    }
    const t = setTimeout(() => setRestante((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [restante, router]);

  return (
    <div className={styles.card} role="status" aria-live="polite">
      <div className={styles.check} aria-hidden="true">✓</div>
      <h1 className={styles.title}>E-mail verificado</h1>
      <p className={styles.texto}>
        Sua conta está ativa. Você será levado ao login em {restante}s.
      </p>
      <div className={styles.trilho} aria-hidden="true">
        <div className={styles.barra} style={{ animationDuration: `${SEGUNDOS}s` }} />
      </div>
      <Link href="/signin" className={styles.btn}>Ir para o login agora</Link>
    </div>
  );
}

function Erro({ codigo }: { codigo: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "enviando" | "ok" | "erro">("idle");

  const reenviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("enviando");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reenviar-verificacao`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "ok" : "erro");
    } catch {
      setStatus("erro");
    }
  };

  return (
    <div className={styles.card} role="alert">
      <div className={styles.check} aria-hidden="true">!</div>
      <h1 className={styles.title}>Não foi possível verificar</h1>
      <p className={styles.texto}>{MENSAGENS[codigo] ?? MENSAGENS.invalido}</p>

      {status === "ok" ? (
        <p className={styles.texto}>Se o e-mail estiver cadastrado, enviamos um novo link.</p>
      ) : (
        <form onSubmit={reenviar}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            className={styles.input}
          />
          <button type="submit" className={styles.btn} disabled={status === "enviando"}>
            {status === "enviando" ? "Enviando..." : "Reenviar link"}
          </button>
          {status === "erro" && <p className={styles.texto}>Falha ao reenviar. Tente de novo.</p>}
        </form>
      )}

      <Link href="/signin" className={styles.btn}>Ir para o login</Link>
    </div>
  );
}

function Conteudo() {
  const codigo = useSearchParams().get("erro");
  return codigo ? <Erro codigo={codigo} /> : <Sucesso />;
}

export default function Verificado() {
  return (
    <div className={styles.container}>
      <div className={styles.blobTopRight} />
      <div className={styles.blobBottomLeft} />
      <Suspense fallback={null}>
        <Conteudo />
      </Suspense>
    </div>
  );
}