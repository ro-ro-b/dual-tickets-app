import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DUAL Tickets | Tokenised Event & Experience Platform',
  description: 'Decentralized event and experience ticketing platform built on DUAL Protocol',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
