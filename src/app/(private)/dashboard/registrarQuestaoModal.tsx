'use client'
import React, { useEffect, useState } from 'react';
import { signOut } from "next-auth/react";
import Input from "@/app/components/Input/input/input";
import styles from './dashboard.module.css';
import { useUser } from "@/app/contexts/UserContext";
import { toastErro, toastSucesso } from '@/app/components/toasts/toastsPersonalizados';
import ConfirmButton from '@/app/components/Button/ConfirmButton';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Disciplina = { id: number; nome: string };
type Prova = { id: number; titulo: string };

export default function Modal({ isOpen, onClose }: ModalProps) {
  const { user } = useUser();
  const usuario_id = user?.id;
  const [disabled, setDisabled] = useState(false);
  const [quantidadeTotal, setQuantidadeTotal] = useState<string>('0');
  const [quantidadeCertas, setQuantidadeCertas] = useState<string>('0');
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [provas, setProvas] = useState<Prova[]>([]);
  const [disciplinaId, setDisciplinaId] = useState<string>('');
  const [provaId, setProvaId] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;


  const extrair = (json: any) =>
    Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
     const carregarDisciplinas = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/disciplina`);
      if (!res.ok) throw new Error('Erro ao buscar disciplinas');
      const json = await res.json();
      console.log('disciplinas:', json);
      setDisciplinas(extrair(json));
    } catch (err) {
      console.error('erro ao carregar disciplinas', err);
      toastErro('Não foi possível carregar as disciplinas.');
    }
  };

  const carregarProvas = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prova`);
      if (!res.ok) throw new Error('Erro ao buscar provas');
      const json = await res.json();
      console.log('provas:', json);
      setProvas(extrair(json));
    } catch (err) {
      console.error('erro ao carregar provas', err);
      toastErro('Não foi possível carregar as provas.');
    }
  };

  const carregarDados = async () => {
    await carregarDisciplinas();
    await carregarProvas();
  };

  carregarDados();

  }, [isOpen]);

  if (!isOpen) return null;

  const enviarDados = async () => {
    if (isNaN(Number(quantidadeTotal)) || isNaN(Number(quantidadeCertas))) {
      toastErro('Por favor, insira valores numéricos válidos para as quantidades.');
      return;
    }
    else if (Number(quantidadeCertas) > Number(quantidadeTotal)) {
      toastErro('A quantidade de acertos não pode ser maior que a quantidade total de questões.');
      return;
    }
    else if (Number(quantidadeTotal) < 0 || Number(quantidadeCertas) < 0) {
      toastErro('As quantidades não podem ser negativas.');
      return;
    }
    else if (!disciplinaId) {
      toastErro('Por favor, selecione uma disciplina.');
      return;
    }
    else if (!provaId) {
      toastErro('Por favor, selecione uma prova.');
      return;
    }
    else if (quantidadeTotal === '0') {
      toastErro('A quantidade total de questões não pode ser zero.');
      return;
    }

    const dados = {
      usuario_id,
      disciplina_id: Number(disciplinaId),
      prova_id: Number(provaId),
      total_questoes: Number(quantidadeTotal),
      total_acertos: Number(quantidadeCertas),
      resolvida_em: new Date().toISOString(),
    };

    setDisabled(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questao_resolvida`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!response.ok) throw new Error('Erro ao enviar dados');

      toastSucesso('Dados enviados com sucesso!');
      setQuantidadeTotal('0');
      setQuantidadeCertas('0');
      setDisciplinaId('');
      setProvaId('');
      onClose();
    }
    catch (error) {
      toastErro('Ocorreu um erro ao enviar os dados. Por favor, tente novamente.');
    }
    finally {
      setDisabled(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.modalCloseButton} onClick={onClose} aria-label="Fechar modal">
          &times;
        </button>
        <h2 className={styles.modalTitle}>Registrar questões</h2>

        <div className={styles.modalForm}>
          <Input
            textLabel="Quantidade de questões resolvidas"
            type="number"
            placeholder="0"
            value={quantidadeTotal}
            id="quantidadeTotal"
            setValue={setQuantidadeTotal}
          />

          <Input
            textLabel="Quantidade de acertos"
            type="number"
            placeholder="0"
            value={quantidadeCertas}
            id="quantidadeCertas"
            setValue={setQuantidadeCertas}
          />

          <div className={styles.selectWrapper}>
            <label htmlFor="prova">Prova</label>
            <select
              id="prova"
              className={styles.select}
              value={provaId}
              onChange={(e) => setProvaId(e.target.value)}
            >
              <option value="">Selecione</option>
              {provas.map((p) => (
                <option key={p.id} value={p.id}>{p.titulo}</option>
              ))}
            </select>
          </div>

          <div className={styles.selectWrapper}>
            <label htmlFor="disciplina">Disciplina</label>
            <select
              id="disciplina"
              className={styles.select}
              value={disciplinaId}
              onChange={(e) => setDisciplinaId(e.target.value)}
            >
              <option value="">Selecione</option>
              {disciplinas.map((d) => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
          </div>

          <ConfirmButton text="Enviar questões" type="submit" onClick={enviarDados} disabled={disabled} />
        </div>
      </div>
    </div>
  );
}



