import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { ProposalProvider } from '@/context/ProposalContext';

const inter = Inter({ subsets: ['latin'] });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-heading', weight: ['400', '700', '900'] });

export const metadata: Metadata = {
  title: 'ChargeSmart EV - Proposal Generator',
  description: 'Generate professional EV charging station proposals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${orbitron.variable}`}>
        <ProposalProvider>{children}</ProposalProvider>
      </body>
    </html>
  );
}
