import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DUAL Tickets | Tokenised Event & Experience Platform',
  description: 'Decentralized event and experience ticketing platform built on DUAL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#f8fafc]">
        {children}
      </body>
    </html>
  );
}
