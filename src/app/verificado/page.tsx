'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./verificado.module.css";

const SEGUNDOS = 5;

export default function Verificado() {
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
    <div className={styles.container}>
      <div className={styles.blobTopRight} />
      <div className={styles.blobBottomLeft} />

      <div className={styles.card} role="status" aria-live="polite">
        <div className={styles.check} aria-hidden="true">✓</div>
        <h1 className={styles.title}>E-mail verificado</h1>
        <p className={styles.texto}>
          Sua conta está ativa. Você será levado ao login em {restante}s.
        </p>

        <div className={styles.trilho} aria-hidden="true">
          <div
            className={styles.barra}
            style={{ animationDuration: `${SEGUNDOS}s` }}
          />
        </div>

        <Link href="/signin" className={styles.btn}>
          Ir para o login agora
        </Link>
      </div>
    </div>
  );
}