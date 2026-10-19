'use client'
import Loading from "../loading";
import { useUser } from "../contexts/UserContext";

export default function AuthGuard({ children}: { children: React.ReactNode } ) {
   const { loading } = useUser();

   if (loading) {
      return <Loading />
   }

   return children;
}