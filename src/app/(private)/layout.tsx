import Providers from "../components/Providers/Providers"
import { UserProvider } from "../contexts/UserContext"
import AuthGuard from "../wrapper/wrapper"
import Sidebar from './Sidebar/Sidebar'
import styles from './layout.module.css'

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <UserProvider>
        <AuthGuard>
          <div className={styles.layout}>
            <Sidebar/>
            <div className={styles.mainWrapper}>
              <main>
                {children}
              </main>
            </div>
          </div>
        </AuthGuard>
      </UserProvider>
    </Providers>
  )
}