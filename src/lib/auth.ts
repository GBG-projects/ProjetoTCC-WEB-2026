import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from "next-auth/providers/google";

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
            senha: credentials?.password,
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks:{
    async signIn({ user }) {
    // procurar no banco
    // se não existir -> criar usuário
    // verified = true
    return true;
    }
  }
}