'use client'

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Clock, Calendar, Mail, Pencil, Shield, TrendingUp, User, X } from "lucide-react";
import { toastErro, toastSucesso } from "@/app/components/toasts/toastsPersonalizados";
import { useUser } from "@/app/contexts/UserContext";
import styles from './profile.module.css'

/**
 * ATENÇÃO: a coluna `tempo_estudo_total` é INTEGER e a unidade não foi informada.
 * Ajuste aqui se o valor estiver em segundos em vez de minutos.
 */
const TEMPO_ESTUDO_EM: 'minutos' | 'segundos' = 'minutos'

interface Usuario {
    id: string
    nome: string
    email: string
    foto: string | null
    role: string
    nivel: number
    tempo_estudo_total: number
    created_at: string
}

function formatarTempo(valor: number) {
    const totalMinutos = TEMPO_ESTUDO_EM === 'segundos' ? Math.floor(valor / 60) : valor
    const horas = Math.floor(totalMinutos / 60)
    const minutos = totalMinutos % 60
    if (horas === 0) return `${minutos} min`
    return `${horas}h ${String(minutos).padStart(2, '0')}min`
}

function formatarData(iso: string) {
    const data = new Date(iso)
    if (Number.isNaN(data.getTime())) return '—'
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatarRole(role: string) {
    if (!role) return '—'
    return role.charAt(0).toUpperCase() + role.slice(1)
}

function Avatar({ src, className }: { src: string | null, className: string }) {
    return (
        <div className={className}>
            {src
                ? <img src={src} alt="Foto de perfil" />
                : <User aria-label="Sem foto de perfil" strokeWidth={1.5} />}
        </div>
    )
}

export default function Profile() {
    const { atualizarUser } = useUser();
    const { data: session } = useSession();
    const user = session?.user

    const [perfil, setPerfil] = useState<Usuario | null>(null)
    const [loading, setLoading] = useState(true)
    const [salvando, setSalvando] = useState(false)

    const [modalAberto, setModalAberto] = useState(false)
    const [nomeEdicao, setNomeEdicao] = useState('')
    const [imagem, setImagem] = useState<File | null>(null)
    const [previewModal, setPreviewModal] = useState<string | null>(null)
    const inputFileRef = useRef<HTMLInputElement>(null)

    const getUser = useCallback(async () => {
        if (!user) return
        setLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuario/${user.id}`)
            if (!response.ok) {
                toastErro('Erro ao carregar suas informações, recarregue a página')
                return
            }
            const data = await response.json()
            atualizarUser(data)
            setPerfil(data)
        } catch (error) {
            toastErro('Erro ao carregar suas informações, recarregue a página')
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        getUser()
    }, [getUser])

    // libera a URL temporária da imagem escolhida
    useEffect(() => {
        return () => {
            if (previewModal?.startsWith('blob:')) URL.revokeObjectURL(previewModal)
        }
    }, [previewModal])

    // fecha o modal com Esc
    useEffect(() => {
        if (!modalAberto) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !salvando) fecharModal()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [modalAberto, salvando])

    const abrirModal = () => {
        if (!perfil) return
        setNomeEdicao(perfil.nome)
        setImagem(null)
        setPreviewModal(perfil.foto)
        setModalAberto(true)
    }

    const fecharModal = () => {
        setModalAberto(false)
        setImagem(null)
        setPreviewModal(null)
    }

    const escolherImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImagem(file)
        setPreviewModal(URL.createObjectURL(file))
    }

    const atualizarUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!user || !perfil) return
        setSalvando(true)
        try {
            const formData = new FormData()
            if (imagem instanceof File) {
                formData.append('foto', imagem)
            }
            formData.append('nome', nomeEdicao.trim())
            formData.append('email', perfil.email)

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuario/${user.id}`, {
                method: 'PUT',
                body: formData
            })
            if (!response.ok) {
                toastErro('Erro ao atualizar suas informações, tente novamente')
                return
            }
            const data = await response.json()
            atualizarUser(data)
            setPerfil(prev => prev ? { ...prev, ...data } : data)
            toastSucesso('Informações atualizadas com sucesso')
            fecharModal()
        } catch (error) {
            toastErro('Erro ao atualizar suas informações, tente novamente')
        } finally {
            setSalvando(false)
        }
    }

    if (!user) {
        return <div className={styles.estado}>Usuário não encontrado</div>
    }

    if (loading || !perfil) {
        return <div className={styles.estado}>Carregando...</div>
    }

    const informacoes = [
        { icone: <User />, rotulo: 'Nome', valor: perfil.nome },
        { icone: <Mail />, rotulo: 'E-mail', valor: perfil.email },
        { icone: <TrendingUp />, rotulo: 'Nível', valor: String(perfil.nivel ?? 0) },
        { icone: <Clock />, rotulo: 'Tempo de estudo', valor: formatarTempo(perfil.tempo_estudo_total ?? 0) },
        { icone: <Shield />, rotulo: 'Tipo de conta', valor: formatarRole(perfil.role) },
        { icone: <Calendar />, rotulo: 'Membro desde', valor: formatarData(perfil.created_at) },
    ]

    return (
        <section className={styles.page}>
            <header className={styles.headerCard}>
                <Avatar src={perfil.foto} className={styles.avatarGrande} />
                <div className={styles.headerInfo}>
                    <h1>{perfil.nome}</h1>
                    <p>{perfil.email}</p>
                </div>
                <button type="button" className={styles.btnEditar} onClick={abrirModal}>
                    <Pencil size={18} />
                    Editar
                </button>
            </header>

            <div className={styles.infoCard}>
                <h2>Informações da conta</h2>
                <dl className={styles.infoLista}>
                    {informacoes.map(item => (
                        <div key={item.rotulo} className={styles.infoLinha}>
                            <dt>
                                {item.icone}
                                {item.rotulo}
                            </dt>
                            <dd>{item.valor}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            {modalAberto && (
                <div
                    className={styles.overlay}
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget && !salvando) fecharModal()
                    }}
                >
                    <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="titulo-modal">
                        <div className={styles.modalHeader}>
                            <h2 id="titulo-modal">Editar perfil</h2>
                            <button
                                type="button"
                                className={styles.btnFechar}
                                onClick={fecharModal}
                                disabled={salvando}
                                aria-label="Fechar"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={atualizarUsuario} className={styles.form}>
                            <div className={styles.fotoEditor}>
                                <button
                                    type="button"
                                    className={styles.fotoBotao}
                                    onClick={() => inputFileRef.current?.click()}
                                    aria-label="Alterar foto de perfil"
                                >
                                    <Avatar src={previewModal} className={styles.avatarModal} />
                                    <span className={styles.cameraBadge}>
                                        <Camera size={16} />
                                    </span>
                                </button>
                                <input
                                    ref={inputFileRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={escolherImagem}
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="nome">Nome</label>
                                <input
                                    id="nome"
                                    type="text"
                                    value={nomeEdicao}
                                    onChange={(e) => setNomeEdicao(e.target.value)}
                                    placeholder="Insira um novo nome"
                                    maxLength={100}
                                    required
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="email">E-mail</label>
                                <input id="email" type="text" value={perfil.email} disabled />
                            </div>

                            <div className={styles.acoes}>
                                <button
                                    type="button"
                                    className={styles.btnCancelar}
                                    onClick={fecharModal}
                                    disabled={salvando}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className={styles.btnSalvar}
                                    disabled={salvando || !nomeEdicao.trim()}
                                >
                                    {salvando ? 'Salvando...' : 'Salvar alterações'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}