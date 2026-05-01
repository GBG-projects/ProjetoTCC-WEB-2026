import { Toaster } from "sonner";
import Providers from "./components/Providers/Providers";
import '@/app/globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
           <Toaster richColors position="bottom-right" /> 
        </Providers>
      </body>
    </html>
  );
}
