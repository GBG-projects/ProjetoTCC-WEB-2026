"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./redefinir-senha.module.css";

type Status = "idle" | "enviando" | "ok" | "erro";

const ERROS: Record<string, string> = {
  invalido: "Link inválido, expirado ou já utilizado. Solicite um novo link.",
  dados: "Dados inválidos. A senha precisa ter pelo menos 8 caracteres.",
  servidor: "Não foi possível redefinir agora. Tente novamente em instantes.",
};

function forcaDaSenha(s: string) {
  let n = 0;
  if (s.length >= 8) n++;
  if (/[A-Z]/.test(s) && /[a-z]/.test(s)) n++;
  if (/\d/.test(s)) n++;
  if (/[^A-Za-z0-9]/.test(s)) n++;
  return n;
}

const CORES = ["#fda4af", "#fda4af", "#fcd34d", "#6ee7b7", "#6ee7b7"];

function SemToken() {
  return (
    <div className={styles.card} role="alert">
      <div className={`${styles.icone} ${styles.iconeErro}`} aria-hidden="true">!</div>
      <h1 className={styles.title}>Link incompleto</h1>
      <p className={styles.subtitle}>
        Não encontramos o código de redefinição. Use o link enviado ao seu e-mail ou peça um novo.
      </p>
      <Link href="/recuperar-senha" className={styles.btn}>Pedir novo link</Link>
    </div>
  );
}

function Sucesso() {
  return (
    <div className={styles.card} role="status" aria-live="polite">
      <div className={`${styles.icone} ${styles.iconeOk}`} aria-hidden="true">✓</div>
      <h1 className={styles.title}>Senha alterada</h1>
      <p className={styles.subtitle}>Sua senha foi atualizada. Entre com a nova senha.</p>
      <Link href="/signin" className={styles.btn}>Ir para o login</Link>
    </div>
  );
}

function Formulario({ token }: { token: string }) {
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [mensagem, setMensagem] = useState("");

  const forca = forcaDaSenha(senha);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");

    if (senha !== confirma) {
      setStatus("erro");
      setMensagem("As senhas não são iguais.");
      return;
    }

    setStatus("enviando");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mudarSenha/redefinir-senha`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, senha }),
      });

      if (res.ok) {
        setStatus("ok");
        return;
      }

      const data = await res.json().catch(() => ({}));
      setMensagem(ERROS[data.erro] ?? ERROS.servidor);
      setStatus("erro");
    } catch {
      setMensagem(ERROS.servidor);
      setStatus("erro");
    }
  };

  if (status === "ok") return <Sucesso />;

  return (
    <div className={styles.card}>
      <div className={styles.icone} aria-hidden="true">🔒</div>
      <h1 className={styles.title}>Criar nova senha</h1>
      <p className={styles.subtitle}>Escolha uma senha com pelo menos 8 caracteres.</p>

      <form onSubmit={enviar} className={styles.form}>
        <div>
          <label htmlFor="senha" className={styles.label}>Nova senha</label>
          <input
            id="senha"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mínimo de 8 caracteres"
            className={styles.input}
          />
          <div className={styles.forca} aria-hidden="true">
            <span style={{ width: `${forca * 25}%`, backgroundColor: CORES[forca] }} />
          </div>
        </div>

        <div>
          <label htmlFor="confirma" className={styles.label}>Confirmar senha</label>
          <input
            id="confirma"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirma}
            onChange={(e) => setConfirma(e.target.value)}
            placeholder="Repita a senha"
            className={styles.input}
          />
        </div>

        {status === "erro" && mensagem && (
          <p className={styles.erro} role="alert">{mensagem}</p>
        )}

        <button type="submit" className={styles.btn} disabled={status === "enviando"}>
          {status === "enviando" ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>

      <Link href="/signin" className={styles.link}>Voltar para o login</Link>
    </div>
  );
}

function Conteudo() {
  const token = useSearchParams().get("token");
  return token ? <Formulario token={token} /> : <SemToken />;
}

export default function RedefinirSenha() {
  return (
    <div className={styles.page}>
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />
      <div className={`${styles.blob} ${styles.blob4}`} />
      <Suspense fallback={null}>
        <Conteudo />
      </Suspense>
    </div>
  );
}