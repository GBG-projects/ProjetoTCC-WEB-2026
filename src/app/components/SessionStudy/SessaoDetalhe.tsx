"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Layers,
  BookOpen,
  Share2,
  Loader2,
  Plus,
} from "lucide-react";
import styles from "./SessaoDetalhe.module.css";
import {
  toastErro,
  toastSucesso,
} from "@/app/components/toasts/toastsPersonalizados";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface Sessao {
  id: number;
  nome?: string;
  disciplina_id: number;
  disciplina_nome?: string;
  tipo: string;
  criado_em: string;
}

interface Pomodoro {
  id: number;
  sessao_id: number;
  titulo: string;
  duracao: number | null;
  ciclos: number | null;
  status: "ativo" | "pausado" | "concluido";
  iniciado_em: string | null;
  tempo_gasto: number;
  criado_em: string;
}

interface FlashcardDeck {
  id: number;
  sessao_id: number;
  titulo: string;
  status: "ativo" | "pausado" | "concluido";
  iniciado_em: string | null;
  tempo_gasto: number;
  criado_em: string;
}

interface MapaMental {
  id: number;
  sessao_id: number;
  titulo: string;
  descricao: string | null;
  link: string | null;
  tempo_gasto: number;
  criado_em: string;
}

interface EstudoLivre {
  id: number;
  sessao_id: number;
  titulo: string;
  meta: number;
  status: "ativo" | "pausado" | "concluido";
  iniciado_em: string | null;
  tempo_gasto: number;
  criado_em: string;
}

import { METODOS, METODOS_LIST } from "./constants";
import NovaSessaoForm from "./NovoMetodo";

type MetodoKey = "pomodoro" | "flashcard" | "mapa_mental" | "livre";

const STATUS_LABEL: Record<string, string> = {
  ativo: "Ativo",
  pausado: "Pausado",
  concluido: "Concluído",
};

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function identificarMetodosPorDados({
  dadosPomodoro,
  dadosFlashcard,
  dadosMapaMental,
  dadosLivre,
}: {
  dadosPomodoro: Pomodoro | null;
  dadosFlashcard: FlashcardDeck | null;
  dadosMapaMental: MapaMental | null;
  dadosLivre: EstudoLivre | null;
}): MetodoKey[] {
  const metodos: MetodoKey[] = [];

  if (dadosPomodoro) {
    metodos.push("pomodoro");
  }

  if (dadosFlashcard) {
    metodos.push("flashcard");
  }

  if (dadosMapaMental) {
    metodos.push("mapa_mental");
  }

  if (dadosLivre) {
    metodos.push("livre");
  }

  return metodos;
}

function formatarDataHora(isoString?: string | null) {
  if (!isoString) return "--";
  const data = new Date(isoString);
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, "0");
  const min = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${hora}:${min}`;
}

function formatarTempo(minutos: number) {
  if (!minutos) return "0 min";
  if (minutos < 60) return `${minutos} min`;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export default function SessaoDetalhe({ sessaoId }: { sessaoId: string }) {
  const [sessao, setSessao] = useState<Sessao | null>(null);

  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState(false);

  const [mostrandoForm, setMostrandoForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [metodoSelecionado, setMetodoSelecionado] = useState<string | null>(
    null,
  );
  const [criandoSessao, setCriandoSessao] = useState(false);

  const [pomodoro, setPomodoro] = useState({
    duracao: 25,
    ciclos: 4,
  });
  const [mapaMental, setMapaMental] = useState({
    descricao: "",
    link: "",
  });
  const [estudoLivre, setEstudoLivre] = useState({
    meta: 60,
  });

  const [carregandoPomodoro, setCarregandoPomodoro] = useState(false);
  const [erroPomodoro, setErroPomodoro] = useState(false);
  const [dadosPomodoro, setDadosPomodoro] = useState<Pomodoro | null>(null);

  const [carregandoFlashcard, setCarregandoFlashcard] = useState(false);
  const [erroFlashcard, setErroFlashcard] = useState(false);
  const [dadosFlashcard, setDadosFlashcard] = useState<FlashcardDeck | null>(null);

  const [carregandoMapaMental, setCarregandoMapaMental] = useState(false);
  const [erroMapaMental, setErroMapaMental] = useState(false);
  const [dadosMapaMental, setDadosMapaMental] = useState<MapaMental | null>(null);

  const [carregandoLivre, setCarregandoLivre] = useState(false);
  const [erroLivre, setErroLivre] = useState(false);
  const [dadosLivre, setDadosLivre] = useState<EstudoLivre | null>(null);

  // Pomodoro
  const carregarPomodoro = useCallback(async () => {
    try {
      setCarregandoPomodoro(true);
      setErroPomodoro(false);

      const res = await fetch(`${API_URL}/api/sessao-estudo/${sessaoId}/pomodoro`);
      if (!res.ok) {
        setErroPomodoro(true);
        return;
      }
      const data = await res.json();
      setDadosPomodoro(data);
    } catch (err) {
      console.error(err);
      setErroPomodoro(true);
      toastErro("Não foi possível carregar o pomodoro.");
    } finally {
      setCarregandoPomodoro(false);
    }
  }, [sessaoId]);

  // Flashcard
  const carregarFlashcard = useCallback(async () => {
    try {
      setCarregandoFlashcard(true);
      setErroFlashcard(false);

      const res = await fetch(`${API_URL}/api/sessao-estudo/${sessaoId}/flashcards`);
      if (!res.ok) {
        setErroFlashcard(true);
        return;
      }
      const data = await res.json();
      setDadosFlashcard(data);
    } catch (err) {
      console.error(err);
      setErroFlashcard(true);
      toastErro("Não foi possível carregar os flashcards.");
    } finally {
      setCarregandoFlashcard(false);
    }
  }, [sessaoId]);

  // Mapa Mental
  const carregarMapaMental = useCallback(async () => {
    try {
      setCarregandoMapaMental(true);
      setErroMapaMental(false);

      const res = await fetch(`${API_URL}/api/sessao-estudo/${sessaoId}/mapa_mental`);
      if (!res.ok) {
        setErroMapaMental(true);
        return;
      }
      const data = await res.json();
      setDadosMapaMental(data);
    } catch (err) {
      console.error(err);
      setErroMapaMental(true);
      toastErro("Não foi possível carregar o mapa mental.");
    } finally {
      setCarregandoMapaMental(false);
    }
  }, [sessaoId]);

  // Estudo Livre
  const carregarLivre = useCallback(async () => {
    try {
      setCarregandoLivre(true);
      setErroLivre(false);

      const res = await fetch(`${API_URL}/api/sessao-estudo/${sessaoId}/livre`);
      if (!res.ok) {
        setErroLivre(true);
        return;
      }
      const data = await res.json();
      setDadosLivre(data);
    } catch (err) {
      console.error(err);
      setErroLivre(true);
      toastErro("Não foi possível carregar o estudo livre.");
    } finally {
      setCarregandoLivre(false);
    }
  }, [sessaoId]);

  const carregarSessaoDados = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(false);

      const resSessao = await fetch(`${API_URL}/api/sessao-estudo/${sessaoId}`);
      if (!resSessao.ok) {
        setErro(true);
        return;
      }
      const dataSessao = await resSessao.json();
      setSessao(dataSessao);

      await Promise.all([
        carregarPomodoro(),
        carregarFlashcard(),
        carregarMapaMental(),
        carregarLivre(),
      ]);
    } catch (err) {
      console.error(err);
      setErro(true);
      toastErro("Não foi possível carregar a sessão.");
    } finally {
      setCarregando(false);
    }
  }, [sessaoId, carregarPomodoro, carregarFlashcard, carregarMapaMental, carregarLivre]);

  useEffect(() => {
    carregarSessaoDados();
  }, [carregarSessaoDados]);

  const handleCriarMetodo = async () => {
    if (!metodoSelecionado || !titulo.trim()) {
      toastErro("Preencha o título e escolha um método.");
      return;
    }

    try {
      setCriandoSessao(true);

      const body: any = {
        titulo,
        sessao_id: Number(sessaoId),
      };

      if (metodoSelecionado === "pomodoro") {
        body.duracao = pomodoro.duracao;
        body.ciclos = pomodoro.ciclos;
      } else if (metodoSelecionado === "mapa_mental") {
        body.descricao = mapaMental.descricao;
      } else if (metodoSelecionado === "livre") {
        body.meta = estudoLivre.meta;
      }

      const ROTA_POR_METODO: Record<string, string> = {
        pomodoro: "pomodoro",
        flashcard: "flashcards", // plural no backend
        mapa_mental: "mapa_mental",
        livre: "livre",
      };

      const res = await fetch(
        `${API_URL}/api/sessao-estudo/${sessaoId}/${ROTA_POR_METODO[metodoSelecionado]}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        console.error("Erro ao criar método:", res.status, errorBody);
        throw new Error(
          errorBody?.error ||
            errorBody?.message ||
            `Erro ao criar método (${res.status})`,
        );
      }

      toastSucesso("Método criado com sucesso!");
      setMostrandoForm(false);
      setTitulo("");
      setMetodoSelecionado(null);

      await carregarSessaoDados();
    } catch (err) {
      console.error(err);
      toastErro("Não foi possível criar o método.");
    } finally {
      setCriandoSessao(false);
    }
  };

  if (carregando) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.estadoCentral}>
            <Loader2 className={styles.spinner} />
            <p>Carregando sessão...</p>
          </div>
        </div>
      </div>
    );
  }

  if (erro || !sessao) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.estadoCentral}>
            <p>Não foi possível encontrar essa sessão.</p>
            <Link href="/sessions-study" className={styles.voltarBtn}>
              <ArrowLeft size={16} />
              Voltar para sessões
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const metodosDisponiveis = identificarMetodosPorDados({
    dadosPomodoro,
    dadosFlashcard,
    dadosMapaMental,
    dadosLivre,
  });

  const carregandoDetalhes =
    carregandoPomodoro ||
    carregandoFlashcard ||
    carregandoMapaMental ||
    carregandoLivre;

  if (mostrandoForm) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <NovaSessaoForm
            METODOS={METODOS_LIST}
            titulo={titulo}
            setTitulo={setTitulo}
            metodoSelecionado={metodoSelecionado}
            setMetodoSelecionado={setMetodoSelecionado}
            onCancelar={() => setMostrandoForm(false)}
            onSubmit={handleCriarMetodo}
            pomodoro={pomodoro}
            setPomodoro={setPomodoro}
            mapaMental={mapaMental}
            setMapaMental={setMapaMental}
            criandoSessao={criandoSessao}
            estudoLivre={estudoLivre}
            setEstudoLivre={setEstudoLivre}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Link href="/sessions-study" className={styles.voltarLink}>
          <ArrowLeft size={16} />
          Voltar
        </Link>

        <div className={styles.card}>
          <div className={styles.header}>
            <div>
              <h2 className={styles.titulo}>{sessao.nome || sessao.tipo}</h2>
              <p className={styles.subtitulo}>
                {sessao.disciplina_nome ?? "Disciplina"} ·{" "}
                {formatarDataHora(sessao.criado_em)}
              </p>
            </div>
          </div>

          <section className={styles.section}>
            <p className={styles.sectionLabel}>Detalhes do método</p>
            <button
              type="button"
              onClick={() => setMostrandoForm(true)}
              className={styles.novaSessaoBtn}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Plus size={16} />
              Criar Método
            </button>

            {carregandoDetalhes && (
              <p className={styles.estadoMensagem}>Carregando detalhes...</p>
            )}

            {!carregandoDetalhes && metodosDisponiveis.length === 0 && (
              <div className={styles.estadoCentral} style={{ padding: "2rem 0" }}>
                <p className={styles.estadoMensagem}>
                  Nenhum registro desse método encontrado ainda para essa sessão.
                </p>
              </div>
            )}

            {!carregandoDetalhes && metodosDisponiveis.length > 0 && (
              <div className={styles.grid}>
                {metodosDisponiveis.map((metodoKey) => {
                  const metodo = METODOS[metodoKey];

                  return (
                    <Link
                      key={metodoKey}
                      href={metodo.path(sessaoId)}
                      className={styles.metodoCardLink}
                      style={{
                        background: metodo.corClara,
                        border: `1px solid ${metodo.cor}55`,
                      }}
                    >
                      <div
                        className={styles.metodoCardIcone}
                        style={{ background: metodo.cor }}
                      >
                        <metodo.icone size={22} />
                      </div>

                      <div className={styles.metodoCardTextos}>
                        <p
                          className={styles.metodoCardTitulo}
                          style={{ color: metodo.cor }}
                        >
                          {metodo.label}
                        </p>

                        <p className={styles.metodoCardSubtitulo}>
                          Abrir tela do método
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          <p className={styles.footerTexto}>
            Continue focando. Você está no caminho certo!
          </p>
        </div>
      </div>
    </div>
  );
}