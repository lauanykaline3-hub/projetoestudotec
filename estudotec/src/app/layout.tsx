import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"Estudo Tec | Aprenda no seu ritmo",description:"Conteúdos e questões organizados para apoiar seus estudos em casa."};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="pt-BR"><body>{children}</body></html>;}
