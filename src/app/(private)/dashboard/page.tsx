'use client'
import React, { useState } from 'react';
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

export function Modal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;
  const { user } = useUser();
  const usuario_id = user?.id;
  const [disabled, setDisabled] = useState<true|false>(false)
  const [quantidadeTotal, setQuantidadeTotal] = useState<string>('0');
  const [quantidadeCertas, setQuantidadeCertas] = useState<string>('0');
  const [disciplina, setDisciplina] = useState<'Ciências humanas' | 'Ciências exatas' | 'Linguagens' | 'Matemática' | 'Nenhuma'>('Nenhuma');
  const enviarDados = async() => {
    if (isNaN(Number(quantidadeTotal)) || isNaN(Number(quantidadeCertas))) {
      toastErro('Por favor, insira valores numéricos válidos para as quantidades.');
      return;
    }
    else if(Number(quantidadeCertas) > Number(quantidadeTotal)){
      toastErro('A quantidade de acertos não pode ser maior que a quantidade total de questões.');
      return;
    }
    else if(Number(quantidadeTotal) < 0 || Number(quantidadeCertas) < 0){
      toastErro('As quantidades não podem ser negativas.');
      return;
    }
    else if(disciplina === 'Nenhuma'){
      toastErro('Por favor, selecione uma disciplina.');
      return;
    }
    else if(quantidadeTotal === '0'){
      toastErro('A quantidade total de questões não pode ser zero.');
      return;
    }
    const dados = {
      usuario_id: usuario_id,
      tipo_questao: disciplina, 
      total_questoes: quantidadeTotal, 
      total_acertos: quantidadeCertas, 
      resolvida_em: new Date().toISOString()
    };
    console.log(new Date().toISOString())
    setDisabled(true);
    try{

      toastErro('Ocorreu um erro ao enviar os dados. Por favor, tente novamente.');
      return;
    }
    finally{
      setQuantidadeTotal('0');
      setQuantidadeCertas('0');
      setDisciplina('Nenhuma');
      setDisabled(false)
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
            <label htmlFor="disciplina">Disciplina</label>
            <select
              id="disciplina"
              className={styles.select}
              value={disciplina}
              onChange={(e) =>
                setDisciplina(
                  e.target.value as
                    | 'Ciências humanas'
                    | 'Ciências exatas'
                    | 'Linguagens'
                    | 'Matemática'
                    | 'Nenhuma'
                )
              }
            >
              <option value="Nenhuma">Nenhuma</option>
              <option value="Ciências humanas">Ciências humanas</option>
              <option value="Ciências exatas">Ciências exatas</option>
              <option value="Linguagens">Linguagens</option>
              <option value="Matemática">Matemática</option>
            </select>
          </div>
            <ConfirmButton text="Enviar questões"
              type="submit"
              onClick={enviarDados}
              disabled={disabled}
              >
              </ConfirmButton>
          
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1>Ola {user?.nome}</h1>
        <h1 className={styles.title}>Dashboard</h1>
        <button className={styles.button} onClick={() => signOut({ callbackUrl: '/' })}>
          sair
        </button>
      </div>

      <button onClick={() => setIsModalOpen(true)} className={styles.openModalButton}>
        Registrar questões
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}


