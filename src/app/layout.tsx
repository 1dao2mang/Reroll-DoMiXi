import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "REROLL | Cyberpunk Case Opening",
  description: "Next-gen case opening experience with cyberpunk aesthetics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
