import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from "next-auth/providers/google";

import { Profile } from 'next-auth'
import { toastSucesso } from '@/app/components/toasts/toastsPersonalizados';

// Adiciona os campos que o Google retorna
interface GoogleProfile extends Profile {
  email_verified?: boolean
  sub?: string
}


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
        return {
          id: String(user.id),
          email: user.email,
          name: user.nome
        }

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
    maxAge: 60*60*24*7
  },
  callbacks:{
    async signIn({ user, profile, account }) {
      if (account?.provider === "credentials") return true;
      if (account?.provider === "google") return true; //  deixa o Google passar
      return false;
    },
    async jwt({token, user, account, profile}){

      if(user?.id){
        token.id = user.id
      }
      if (account?.provider === "google" && profile) {
      const googleProfile = profile as GoogleProfile
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleProfile.email,
          nome: googleProfile.name,
          googleId: googleProfile.sub,
        }),
      });

      const dbUser = await response.json()
      token.id = String(dbUser.id)
    }
      return token
    },
    async session({session, token}){
      if(token.id){
        session.user.id = token.id
      }
      return session;
    }

          
  }
}