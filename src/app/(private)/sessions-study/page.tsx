"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Plus, MoreVertical } from "lucide-react";
import styles from "./SessionStudy.module.css";
import { toastErro } from "@/app/components/toasts/toastsPersonalizados";
import NovaSessaoModal from "@/app/components/SessionStudy/NovaSessaoModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface Sessao {
  id: number;
  nome: string;
  usuario_id: string;
  disciplina_id: number;
  tipo: string;
  criado_em: string;
}
interface Disciplina {
  nome: string;
  id: number;
}

function formatarDataHora(isoString: string) {
  if (!isoString) return "--";
  const data = new Date(isoString);
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, "0");
  const min = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${hora}:${min}`;
}

function disciplinaInfo({disciplinaId, disciplinas}:{disciplinaId: number, disciplinas: Disciplina[]}) {
  return disciplinas.find((d) => d.id === disciplinaId);
}

export default function SessionStudy() {
  const { data: session } = useSession();

  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [menuAbertoId, setMenuAbertoId] = useState<number | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [criandoSessao, setCriandoSessao] = useState(false);

  const carregarSessoes = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      setCarregando(true);

      const params = new URLSearchParams();
      if (disciplinaSelecionada)
        params.set("disciplina_id", disciplinaSelecionada);

      const res = await fetch(
        `${API_URL}/api/sessao-estudo/usuario/${session.user.id}?${params.toString()}`,
      );

      if (!res.ok) {
        toastErro(`Erro ao buscar sessões (status ${res.status})`);
        return;
      }

      const data = await res.json();

      setSessoes(data);
    } catch (err) {
      console.error(err);
      toastErro("Não foi possível carregar suas sessões. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }, [session?.user?.id, disciplinaSelecionada]);

  const carregarDisciplinas = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/disciplina`);
      if (!res.ok) return;
      const data = await res.json();
      setDisciplinas(data);
    } catch (err) {
      console.error("erro ao carregar disciplinas", err);
    }
  }, []);

  useEffect(() => {
    carregarSessoes();
  }, [carregarSessoes]);

  useEffect(() => {
    carregarDisciplinas();
  }, [carregarDisciplinas]);

  async function criarSessao({ disciplina_id, tipo }:{disciplina_id:number, tipo:string}) {
    if (!session?.user?.id) {
      toastErro("Usuário não autenticado.");
      return;
    }

    setCriandoSessao(true);

    try {
      const body = {
        usuario_id: session.user.id,
        disciplina_id,
        tipo,
      };

      const res = await fetch(
        `${API_URL}/api/sessao-estudo/usuario/${session.user.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) {
        throw new Error("Erro ao criar sessão.");
      }

      const novaSessao = await res.json();

      setSessoes((prev) => [novaSessao, ...prev]);
      await carregarSessoes()
      setModalAberto(false);
    } catch (err) {
      console.error(err);
      toastErro("Não foi possível criar a sessão.");
    } finally {
      setCriandoSessao(false);
    }
  }

  async function excluirSessao(id:number) {
    setMenuAbertoId(null);
    try {
      const res = await fetch(`${API_URL}/api/sessao-estudo/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Falha ao excluir sessão");
      setSessoes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      toastErro("Não foi possível excluir a sessão.");
    }
  }
  console.log(sessoes.map((s) => s.id));

  return (
    <div className={styles.page}>
      <Image
        src="/logoFocus.png"
        alt="Focus Flow"
        width={10}
        height={10}
        priority
        unoptimized
        className={styles.logo}
      />
      <div className={styles.content}>
        <main className={`${styles.card} ${styles.main}`}>
          <div className={styles.headerRow}>
            <h2 className={styles.title}>Minhas Sessões de Estudo</h2>

            <button
              onClick={() => setModalAberto(true)}
              className={styles.novaSessaoBtn}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Plus />
              Nova Sessão
            </button>
          </div>

          <p className={styles.subtitle}>
            Crie uma nova sessão para manter seu foco no que realmente importa.
          </p>

          <section className={styles.section}>
            <div className={styles.headerRow}>
              <p className={styles.sectionLabel}>Filtrar por disciplina</p>

              <select
                value={disciplinaSelecionada}
                onChange={(e) => setDisciplinaSelecionada(e.target.value)}
                className={styles.filtroSelect}
              >
                <option value="">Todas as disciplinas</option>

                {disciplinas.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome}
                  </option>
                ))}
              </select>
            </div>

            {carregando && (
              <p className={styles.estadoMensagem}>Carregando sessões...</p>
            )}

            {!carregando && sessoes.length > 0 && (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHeadRow}>
                      <th>Disciplina</th>
                      <th>Tipo</th>
                      <th>Início</th>
                      <th>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sessoes.map((s) => {
                      const disciplina = disciplinaInfo(
                        {
                        disciplinaId: s.disciplina_id,
                        disciplinas
                        }
                      );

                      return (
                        <tr key={`sessao-${s.id}`} className={styles.tableRow}>
                          <td>
                            <span className={styles.tituloCell}>
                              <span
                                className={styles.tituloDot}
                                style={{
                                  backgroundColor:"#ffffff",
                                }}
                              />
                              {disciplina?.nome ?? "--"}
                            </span>
                          </td>

                          <td>{s.tipo}</td>

                          <td className={styles.dataTexto}>
                            {formatarDataHora(s.criado_em)}
                          </td>

                          <td className={styles.acoesCell}>
                            <button
                              onClick={() =>
                                setMenuAbertoId(
                                  menuAbertoId === s.id ? null : s.id,
                                )
                              }
                              className={styles.menuBtn}
                            >
                              <MoreVertical />
                            </button>

                            {menuAbertoId === s.id && (
                              <div className={styles.menuDropdown}>
                                <Link href={`/sessions-study/session/${s.id}`}>
                                  Continuar
                                </Link>

                                <button
                                  onClick={() => excluirSessao(s.id)}
                                  className={styles.menuExcluir}
                                >
                                  Excluir
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <p className={styles.footerTexto}>
            Continue focando. Você está no caminho certo!
          </p>
        </main>
      </div>

      <NovaSessaoModal
        aberto={modalAberto}
        disciplinas={disciplinas}
        criando={criandoSessao}
        onFechar={() => setModalAberto(false)}
        onCriar={criarSessao}
      />
    </div>
  );
}
