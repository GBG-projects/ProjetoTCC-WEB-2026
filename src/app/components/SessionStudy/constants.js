import {
  Clock,
  Calendar,
  CheckCircle2,
  Share2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const METODOS = {
  pomodoro: {
    id: "pomodoro",
    label: "Pomodoro",
    desc: "Estude em blocos de foco com descansos curtos.",
    icon: Clock,
    icone: Clock,
    badgeClass: "badgePomodoro",
    cor: "#35a2b0",
    corClara: "rgba(249, 115, 22, 0.15)",
    rota: (sessaoId) => `${API_URL}/api/sessao-estudo/${sessaoId}/pomodoro`,
    path: (sessaoId) => `/sessions-study/session/${sessaoId}/pomodoro`,
  },
  flashcard: {
    id: "flashcard",
    label: "Flashcard",
    desc: "Utilize cartões rápidos para maximizar o estudo!",
    icon: Calendar,
    icone: Calendar,
    badgeClass: "badgeFlashcard",
    cor: "#3b82f6",
    corClara: "rgba(59, 130, 246, 0.15)",
    rota: (sessaoId) => `${API_URL}/api/sessao-estudo/${sessaoId}/flashcards`,
    path: (sessaoId) => `/sessions-study/session/${sessaoId}/flashcard`,
  },
  livre: {
    id: "livre",
    label: "Livre",
    desc: "Estude de forma livre e flexível.",
    icon: CheckCircle2,
    icone: CheckCircle2,
    badgeClass: "badgeLivre",
    cor: "#4353a5",
    corClara: "rgba(34, 197, 94, 0.15)",
    rota: (sessaoId) => `${API_URL}/api/sessao-estudo/${sessaoId}/livre`,
    path: (sessaoId) => `/sessions-study/session/${sessaoId}/free`,
  },
  mapa_mental: {
    id: "mapa_mental",
    label: "Mapa Mental",
    desc: "Revisite informações e crie anotações com o Miro.",
    icon: Share2,
    icone: Share2,
    badgeClass: "badgeMapaMental",
    cor: "#a855f7",
    corClara: "rgba(168, 85, 247, 0.15)",
    rota: (sessaoId) => `${API_URL}/api/sessao-estudo/${sessaoId}/mapa_mental`,
    path: (sessaoId) => `/sessions-study/session/${sessaoId}/mind_map`,
  },
};

export const METODOS_LIST = Object.values(METODOS);