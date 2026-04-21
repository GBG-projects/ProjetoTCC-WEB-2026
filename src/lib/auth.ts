import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials?.email,
        password: credentials?.password,
      }),
    });

    if (!response.ok) return null;

    const user = await response.json();
    return user ?? null;

  } catch (error) {
    console.error('Erro durante a autenticação:', error);
    return null;
  }
},
    }),
  ],
  session: {
    strategy: 'jwt',
  }
}