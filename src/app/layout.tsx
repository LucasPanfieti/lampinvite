import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LampInvite",
  description: "Crie convites para seus eventos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
