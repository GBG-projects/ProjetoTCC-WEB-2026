'use client';

import { usePathname } from 'next/navigation';
import { User, Folder, FileText, List, LogOut, Calendar, NotebookPen } from 'lucide-react';
import { signOut } from 'next-auth/react';

import styles from './Sidebar.module.css';
import { useUser } from '@/app/contexts/UserContext';
import Link from 'next/link';

const NAV_ITEMS = [
  { id: 'compromisso', label: 'Compromissos', icon: Calendar, href: '/dashboard'},
  { id: 'sessao', label: 'Suas sessões', icon: NotebookPen, href: '/sessions-study'},
  { id: 'perfil', label: 'Meu Perfil', icon: User, href: '/profile' },
  { id: 'materiais', label: 'Materiais', icon: Folder, href: '/material' },
  { id: 'provas', label: 'Provas', icon: FileText, href: '/test' },
  { id: 'relatorio', label: 'Relatório', icon: List, href: '/relatorio' },
];

export default function Sidebar() {
  const { user } = useUser();
  const pathname = usePathname();

  const fotoUsuario = user?.foto;
  const nomeUsuario = user?.nome;

  return (
    <aside className={`${styles.card} ${styles.sidebar}`}>
      <div className={styles.perfil}>
        <div className={styles.avatar}>
          {fotoUsuario ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fotoUsuario} alt={nomeUsuario} />
          ) : (
            <User className={styles.avatarIcon} />
          )}
        </div>
        <p className={styles.nome}>Olá, {nomeUsuario}!</p>
        <p className={styles.subtitulo}>Foco é o caminho</p>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const ativo = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.navItem} ${ativo ? styles.navItemAtivo : ''}`}
            >
              <Icon />
              {item.label}
            </Link>
          );
        })}

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={`${styles.navItem} ${styles.sair}`}
        >
          <LogOut />
          Sair
        </button>
      </nav>
    </aside>
  );
}