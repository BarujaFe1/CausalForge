import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CausalForge — Responsible Causal Inference Lab",
  description:
    "Measure intervention impact with Diff-in-Diff or matching — assumptions, uncertainty and declared limitations. No automatic causality.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo-principal">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
