import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SunoGov — Apni Baat, Sahi Jagah",
  description:
    "A civic complaint routing tool for Pakistani citizens. Describe any public service issue and SunoGov identifies the exact government department responsible, then helps you file a formal complaint in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
