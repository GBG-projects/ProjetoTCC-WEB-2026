import Providers from "../components/Providers/Providers"
import Header from './Header/header'
export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <Header/>
      <div>
        <main>
          {children}
        </main>
      </div>
    </Providers>
  )
}