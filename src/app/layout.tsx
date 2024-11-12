import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { WagmiProvider, useAccount } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import "./globals.css";
import { wagmiConfig } from '@config/wagmi.config'
import { Account } from "@components/Account";
import { WalletOptions } from "@components/WalletOptions";

const inter = Inter({ subsets: ["latin"] });

const viewPort: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "ZKS",
  description: "Generate and verify zk proofs of solvency",
  viewport: viewPort,
};

const queryClient = new QueryClient();

function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ConnectWallet />
          <body className={inter.className}>{children}</body>
        </QueryClientProvider>
      </WagmiProvider>
    </html>
  );
}
