"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  format,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useUser } from "@/app/contexts/UserContext";
import {
  toastErro,
  toastSucesso,
} from "@/app/components/toasts/toastsPersonalizados";
import Modal from "./registrarQuestaoModal";
import styles from "./calendario.module.css";

const API = process.env.NEXT_PUBLIC_API_URL;
type Compromisso = {
  id: number;
  descricao: string;
  data_entrega: string;
  status: "pendente" | "concluido" | "cancelado";
};

const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const OPCOES_ANTECEDENCIA = [0, 1, 2, 3, 7];

type Notificacao = {
  id: number;
  mensagem: string;
  lida: boolean;
  data_entrega: string;
};

export default function Dashboard() {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mesAtual, setMesAtual] = useState(() => startOfMonth(new Date()));
  const [diaSelecionado, setDiaSelecionado] = useState<Date>(new Date());
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novaHora, setNovaHora] = useState("23:59");
  const [novaData, setNovaData] = useState(format(new Date(), "yyyy-MM-dd"));

  const dias = eachDayOfInterval({
    start: startOfWeek(startOfMonth(mesAtual)),
    end: endOfWeek(endOfMonth(mesAtual)),
  });

  const chaveDia = (d: Date) => format(d, "yyyy-MM-dd");
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const vistas = useRef<Set<number>>(new Set());
  const primeiraCarga = useRef(true);
  const [antecedencias, setAntecedencias] = useState<number[]>([1]);

  const alternarAntecedencia = (d: number) =>
    setAntecedencias((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  useEffect(() => {
    if (!user?.id) return;

    const buscar = async () => {
      try {
        const res = await fetch(`${API}/api/notificacao/usuario/${user.id}`);
        if (!res.ok) return;
        const lista: Notificacao[] = await res.json();
        setNotificacoes(lista);

        lista.forEach((n) => {
          if (!vistas.current.has(n.id)) {
            vistas.current.add(n.id);
            if (!primeiraCarga.current && !n.lida) toastSucesso(n.mensagem);
          }
        });
        primeiraCarga.current = false;
      } catch (err) {
        console.error("erro ao buscar notificações", err);
      }
    };

    buscar();
    const intervalo = setInterval(buscar, 30_000);
    return () => clearInterval(intervalo);
  }, [user?.id]);
  
  const carregarCompromissos = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API}/api/compromisso/usuario/${user.id}`);
      if (!res.ok) throw new Error("Erro ao buscar compromissos");
      const json = await res.json();
      setCompromissos(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("erro ao carregar compromissos", err);
      toastErro("Não foi possível carregar os compromissos.");
    }
  }, [user?.id]);

  useEffect(() => {
    carregarCompromissos();
  }, [carregarCompromissos]);

  const doDia = (dia: Date) =>
    compromissos.filter(
      (c) => String(c.data_entrega).slice(0, 10) === chaveDia(dia),
    );

  const compromissosSelecionado = doDia(diaSelecionado);

  const criarCompromisso = async () => {
    if (!novaDescricao.trim() || !novaData) {
      toastErro("Informe a descrição e a data do compromisso.");
      return;
    }
    try {
      const res = await fetch(`${API}/api/compromisso/usuario/${user?.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descricao: novaDescricao.trim(),
          data_entrega: `${novaData} ${novaHora}:00`,
          antecedencias,
        }),
      });
      if (!res.ok) throw new Error("Erro ao criar compromisso");
      toastSucesso("Compromisso criado!");
      setNovaDescricao("");
      await carregarCompromissos();
    } catch (err) {
      console.error(err);
      toastErro("Não foi possível criar o compromisso.");
    }
  };

  const alternarStatus = async (id: number) => {
    try {
      const res = await fetch(`${API}/api/compromisso/${id}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Erro ao atualizar compromisso");
      await carregarCompromissos();
    } catch (err) {
      console.error(err);
      toastErro("Não foi possível atualizar o compromisso.");
    }
  };

  const selecionarDia = (dia: Date) => {
    setDiaSelecionado(dia);
    setNovaData(chaveDia(dia));
  };

  const mudarData = (valor: string) => {
    setNovaData(valor);
    if (!valor) return;
    const dia = new Date(`${valor}T00:00:00`);
    setDiaSelecionado(dia);
    setMesAtual(startOfMonth(dia));
  };

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  const formatarEntrega = (iso: string) => {
    const s = String(iso);
    return `${s.slice(8, 10)}/${s.slice(5, 7)} às ${s.slice(11, 16)}`;
  };

  const marcarLida = async (id: number) => {
    try {
      const res = await fetch(`${API}/api/notificacao/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Erro ao marcar como lida");
      setNotificacoes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: true } : n)),
      );
    } catch (err) {
      console.error(err);
      toastErro("Não foi possível marcar como lida.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.blobTopRight} />
      <div className={styles.blobTopRightSmall} />
      <div className={styles.blobBottomLeft} />
      <div className={styles.blobBottomLeftSmall} />

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>Olá, {user?.nome}</h1>
            <p>Seus compromissos e estudos em um só lugar</p>
          </div>
        </div>

        <div className={styles.content}>
          <section className={styles.calendarSection}>
            <div className={styles.calendarHeader}>
              <button
                className={styles.btnGhost}
                onClick={() => setMesAtual(subMonths(mesAtual, 1))}
              >
                ‹
              </button>
              <h2>{format(mesAtual, "MMMM 'de' yyyy", { locale: ptBR })}</h2>
              <button
                className={styles.btnGhost}
                onClick={() => setMesAtual(addMonths(mesAtual, 1))}
              >
                ›
              </button>
            </div>

            <div className={styles.weekdays}>
              {DIAS_SEMANA.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className={styles.grid}>
              {dias.map((dia) => {
                const itens = doDia(dia);
                const classes = [
                  styles.day,
                  !isSameMonth(dia, mesAtual) ? styles.dayOutside : "",
                  isToday(dia) ? styles.dayToday : "",
                  isSameDay(dia, diaSelecionado) ? styles.daySelected : "",
                ].join(" ");

                return (
                  <button
                    key={dia.toISOString()}
                    className={classes}
                    onClick={() => selecionarDia(dia)}
                  >
                    <span className={styles.dayNumber}>{format(dia, "d")}</span>
                    {itens.slice(0, 2).map((c) => (
                      <span
                        key={c.id}
                        className={`${styles.chip} ${styles[`chip_${c.status}`]}`}
                      >
                        {c.descricao}
                      </span>
                    ))}
                    {itens.length > 2 && (
                      <span className={styles.more}>+{itens.length - 2}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <aside className={styles.side}>
            <section className={styles.panel}>
              <h3>{format(diaSelecionado, "d 'de' MMMM", { locale: ptBR })}</h3>

              {compromissosSelecionado.length === 0 ? (
                <p className={styles.vazio}>Nenhum compromisso neste dia.</p>
              ) : (
                <div className={styles.lista}>
                  {compromissosSelecionado.map((c) => (
                    <div key={c.id} className={styles.item}>
                      <p
                        className={`${styles.itemTitulo} ${c.status === "concluido" ? styles.itemConcluido : ""}`}
                      >
                        {c.descricao}
                      </p>
                      <button
                        className={styles.iconBtn}
                        onClick={() => alternarStatus(c.id)}
                        disabled={c.status === "cancelado"}
                        aria-label="Alternar status"
                      >
                        ✓
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.form}>
                <input
                  className={styles.input}
                  placeholder="Novo compromisso"
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                />

                <div className={styles.linhaData}>
                  <input
                    className={styles.input}
                    type="date"
                    value={novaData}
                    onChange={(e) => mudarData(e.target.value)}
                  />
                  <input
                    className={styles.input}
                    type="time"
                    value={novaHora}
                    onChange={(e) => setNovaHora(e.target.value)}
                  />
                </div>
                <div className={styles.antecedencias}>
                  <span className={styles.panelTexto}>Avisar:</span>
                  {OPCOES_ANTECEDENCIA.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={`${styles.chipOpcao} ${antecedencias.includes(d) ? styles.chipOpcaoAtiva : ""}`}
                      onClick={() => alternarAntecedencia(d)}
                    >
                      {d === 0 ? "No horário" : `${d}d antes`}
                    </button>
                  ))}
                </div>
                <button className={styles.btnCriar} onClick={criarCompromisso}>
                  Adicionar
                </button>
              </div>
            </section>

            <section className={styles.panel}>
              <h3>Questões</h3>
              <p className={styles.panelTexto}>
                Registre as questões que você resolveu.
              </p>
              <button
                className={styles.btnCriar}
                onClick={() => setIsModalOpen(true)}
              >
                Registrar questões
              </button>
            </section>

            <section className={styles.panel}>
              <h3>
                Notificações
                {naoLidas > 0 && (
                  <span className={styles.contador}>{naoLidas}</span>
                )}
              </h3>

              {notificacoes.length === 0 ? (
                <p className={styles.vazio}>Nenhuma notificação.</p>
              ) : (
                <div className={styles.lista}>
                  {notificacoes.map((n) => (
                    <div
                      key={n.id}
                      className={`${styles.item} ${n.lida ? styles.itemLida : ""}`}
                    >
                      <div className={styles.itemTexto}>
                        <p className={styles.itemTitulo}>{n.mensagem}</p>
                        <span className={styles.itemData}>
                          Entrega: {formatarEntrega(n.data_entrega)}
                        </span>
                      </div>
                      {!n.lida && (
                        <button
                          className={styles.iconBtn}
                          onClick={() => marcarLida(n.id)}
                          aria-label="Marcar como lida"
                        >
                          ✓
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
