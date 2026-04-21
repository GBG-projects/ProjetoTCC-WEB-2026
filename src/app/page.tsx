'use client'

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import styles from "./page.module.css";


const devs = [
  { name: "Gustavo Henrique", instagram: "sant0s.gusta" },
  { name: "Grazielle Mariano", instagram: "grazimariano_" },
  { name: "Brendo Antonio", instagram: "brendo_ant08" },
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return null;
  }

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.brand}>
        
          <span className={styles.brandName}>Focus Flow</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/signin" className={styles["btn-links"]}>
            Entrar
          </Link>
          <Link href="/signup" className={styles["btn-links"]}>
            Registrar-se
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <span className={styles.badge}>
          Organize seus estudos com inteligência
        </span>
        <h1 className={styles.title}>
          Estude com foco.
          <br />
          <span className={styles.titleHighlight}>Aprenda com fluidez.</span>
        </h1>
        <p className={styles.subtitle}>
          O Focus Flow a plataforma que te ajuda a planejar sessões
          de estudo, acompanhar compromissos
          \use em qualquer lugar.
        </p>
        <Link href="/signup" className={styles["btn-primary"]}>
          Começar agora
        </Link>
      </section>

      {/* Devs */}
      <section className={styles.devs}>
        <h2 className={styles.sectionTitle}>Desenvolvedores do projeto</h2>
        <div className={styles["devs-grid"]}>
          {devs.map((dev) => (
            <a
              key={dev.name}
              href={`https://instagram.com/${dev.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles["dev-card"]}
            >
              <div className={styles["dev-avatar"]}>
                <User className={styles.avatarIcon} />
              </div>
              <h3 className={styles["dev-name"]}>{dev.name}</h3>
              <span className={styles["dev-handle"]}>@{dev.instagram}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Focus Flow Projeto de TCC
      </footer>
    </div>
  );
}
