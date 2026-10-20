"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./recuperar-senha.module.css";

type Status = "idle" | "enviando" | "ok" | "erro";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("enviando");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mudarSenha/recuperar-senha`, {
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
    <div className={styles.page}>
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />
      <div className={`${styles.blob} ${styles.blob4}`} />

      {status === "ok" ? (
        <div className={styles.card} role="status" aria-live="polite">
          <div className={`${styles.icone} ${styles.iconeOk}`} aria-hidden="true">✓</div>
          <h1 className={styles.title}>Confira seu e-mail</h1>
          <p className={styles.subtitle}>
            Se o e-mail estiver cadastrado, enviamos um link válido por 1 hora.
            Veja também a caixa de spam.
          </p>
          <Link href="/signin" className={styles.btn}>Ir para o login</Link>
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.icone} aria-hidden="true">?</div>
          <h1 className={styles.title}>Recuperar senha</h1>
          <p className={styles.subtitle}>
            Informe seu e-mail e enviaremos um link para criar uma nova senha.
          </p>

          <form onSubmit={enviar} className={styles.form}>
            <div>
              <label htmlFor="email" className={styles.label}>E-mail</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                className={styles.input}
              />
            </div>

            {status === "erro" && (
              <p className={styles.erro} role="alert">
                Não foi possível enviar agora. Tente novamente em instantes.
              </p>
            )}

            <button type="submit" className={styles.btn} disabled={status === "enviando"}>
              {status === "enviando" ? "Enviando..." : "Enviar link"}
            </button>
          </form>

          <Link href="/signin" className={styles.link}>Voltar para o login</Link>
        </div>
      )}
    </div>
  );
}