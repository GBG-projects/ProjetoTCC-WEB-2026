'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  nome: string;
  email: string;
  foto: string | null;
  role: string;
  nivel: number;
  tempo_estudo_total: number;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  atualizarUser: (dados: Partial<User>) => void;
  recarregarUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const atualizarUser = useCallback((dados: Partial<User>) => {
  setUser(prev => prev ? { ...prev, ...dados } : null);
}, []);

const userId = session?.user?.id;

const fetchUser = useCallback(async () => {
  if (!userId) return;
  setLoading(true);
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/usuario/${userId}`;
    const response = await fetch(url);
    if (!response.ok) return;
    setUser(await response.json());
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
  } finally {
    setLoading(false);
  }
}, [userId]);

useEffect(() => {
  if (status === "unauthenticated") {
    setUser(null); 
    return;
  }
  fetchUser();
}, [status, userId, fetchUser]);

const recarregarUser = useCallback(async () => {
  await fetchUser();
}, [fetchUser]);

useEffect(() => {
  fetchUser();
}, [fetchUser]);

const value = useMemo(
  () => ({ user, loading, atualizarUser, recarregarUser }),
  [user, loading, atualizarUser, recarregarUser]
);

return (
  <UserContext.Provider value={value}>
    {children}
  </UserContext.Provider>
);
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser deve ser usado dentro do UserProvider');
  return context;
}