import Providers from "../components/Providers/Providers"
import { UserProvider } from "../contexts/UserContext"
import AuthGuard from "../wrapper/wrapper"
import Header from './Header/header'
export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <UserProvider>
      <AuthGuard>

        <Header/>

        <div>
          <main>
            {children}
          </main>
        </div>
      </AuthGuard>
      </UserProvider>
    </Providers>
  )
}