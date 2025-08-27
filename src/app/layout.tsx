import './globals.css';
import type { Metadata, Viewport } from "next";
import { type ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';

import { getConfig } from '@/config/wagmi.config';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ["latin"] });

//TODO: invalid viewport, need to fix
// const viewPort: Viewport = {
//   width: "device-width",
//   initialScale: 1,
// };

export const metadata: Metadata = {
  title: "ZKS",
  description: "Generate and verify zk proofs of solvency",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get('cookie'),
  )
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers initialState={initialState}>{props.children}</Providers>
      </body>
    </html>
  );
}
