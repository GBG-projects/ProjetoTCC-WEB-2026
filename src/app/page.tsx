import Link from "next/link";
import styles from "./page.module.css";

const devs = [
  { name: "Gustavo Henrique", instagram: "sant0s.gusta" },
  { name: "Grazielle Mariano", instagram: "grazimariano_" },
  { name: "Brendo Antonio", instagram: "brendo_ant08" },
];

const MARCADOS: Record<number, "pendente" | "concluido"> = {
  7: "pendente", 14: "pendente", 16: "concluido", 21: "pendente", 28: "pendente",
};
const HOJE = 18;
const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const celulas = Array.from({ length: 35 }, (_, i) => i - 3);

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      <nav className={`${styles.wrap} ${styles.nav}`}>
        <span className={styles.brand}>Focus Flow</span>
        <div className={styles.navLinks}>
          <Link href="/signin" className={styles.linkEntrar}>Entrar</Link>
          <Link href="/signup" className={styles.btnNav}>Registrar-se</Link>
        </div>
      </nav>

      <main className={styles.wrap}>
        <section className={styles.hero}>
          <div>
            <h1 className={styles.title}>
              Seus prazos, questões e estudos{" "}
              <span className={styles.marca}>num lugar só</span>.
            </h1>
            <p className={styles.subtitle}>
              Veja os compromissos no calendário, receba aviso antes de cada
              entrega e registre as questões que você resolveu.
            </p>
            <div className={styles.actions}>
              <Link href="/signup" className={styles.btnPrimary}>Criar conta</Link>
              <Link href="/signin" className={styles.linkSecundario}>Já tenho conta</Link>
            </div>
          </div>

          <div className={styles.visual} aria-hidden="true">
            <div className={styles.cal}>
              <div className={styles.calHeader}>
                <strong>Outubro</strong>
                <span>5 compromissos</span>
              </div>
              <div className={styles.calWeek}>
                {DIAS_SEMANA.map((d, i) => <span key={i}>{d}</span>)}
              </div>
              <div className={styles.calGrid}>
                {celulas.map((dia, i) => {
                  const valido = dia >= 1 && dia <= 31;
                  const status = valido ? MARCADOS[dia] : undefined;
                  const cls = [
                    styles.cell,
                    !valido ? styles.cellVazia : "",
                    dia === HOJE ? styles.cellHoje : "",
                  ].join(" ");
                  return (
                    <span key={i} className={cls}>
                      {valido && dia}
                      {status && (
                        <i className={`${styles.pip} ${status === "concluido" ? styles.pipOk : ""}`} />
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className={styles.toast}>
              <span className={styles.toastDot} />
              Faltam 3 dias: Entregar relatório
            </div>
          </div>
        </section>

        <section className={styles.recursos}>
          <h2 className={styles.secTitle}>O que já funciona</h2>
          <div className={styles.bento}>
            <article className={`${styles.tile} ${styles.tileCalendario}`}>
              <h3>Calendário de compromissos</h3>
              <p>Cada prazo no dia certo. Clique num dia para ver tudo o que vence nele.</p>
              <div className={styles.miniChips}>
                <span className={styles.miniChip}>Prova de Cálculo</span>
                <span className={`${styles.miniChip} ${styles.miniChipOk}`}>Lista de exercícios</span>
                <span className={styles.miniChip}>Relatório</span>
              </div>
            </article>

            <article className={`${styles.tile} ${styles.tileAvisos}`}>
              <h3>Aviso no tempo que você escolher</h3>
              <p>Marque quantos dias antes quer ser lembrado. Pode ser mais de um por compromisso.</p>
              <div className={styles.opcoes}>
                <span className={styles.opcaoAtiva}>No horário</span>
                <span className={styles.opcaoAtiva}>1d antes</span>
                <span>2d antes</span>
                <span className={styles.opcaoAtiva}>3d antes</span>
                <span>7d antes</span>
              </div>
            </article>

            <article className={`${styles.tile} ${styles.tileQuestoes}`}>
              <h3>Questões</h3>
              <p>Registre quantas resolveu e quantas acertou, por prova e disciplina.</p>
              <div className={styles.linhaQuestao}>
                <span>Matemática</span>
                <strong>12 / 15</strong>
              </div>
            </article>

            <article className={`${styles.tile} ${styles.tileSessoes}`}>
              <h3>Sessões de estudo</h3>
              <p>Pomodoro, flashcards, mapa mental ou estudo livre.</p>
            </article>
          </div>
        </section>

        <section className={styles.devsSec}>
          <h2 className={styles.secTitle}>Quem fez</h2>
          <div className={styles.devs}>
            {devs.map((dev) => (
              <a
                key={dev.name}
                href={`https://instagram.com/${dev.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.dev}
              >
                <span className={styles.inicial}>{dev.name[0]}</span>
                <span className={styles.devTexto}>
                  <strong>{dev.name}</strong>
                  <small>@{dev.instagram}</small>
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className={`${styles.wrap} ${styles.footer}`}>
        &copy; {new Date().getFullYear()} Focus Flow · Projeto de TCC
      </footer>
    </div>
  );
}