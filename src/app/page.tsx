'use client';
import Link from 'next/link';
import Image from 'next/image';

import Button from "@/components/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-900 flex flex-col">
      <header className="w-full">
        <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Zero Knowledge Solvency logo" width={40} height={40} className="h-10 w-10" />
            <span className="text-xl sm:text-2xl font-bold text-green-400 glow">Zero Knowledge Solvency</span>
          </Link>
          {/* <WalletConnect /> */}
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="relative">
          <div className="absolute inset-0 -z-10 flex place-items-center before:absolute before:h-[260px] before:w-full sm:before:w-[520px] before:left-1/2 before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:opacity-10 before:content-[''] after:absolute after:-z-20 after:h-[200px] after:w-full sm:after:w-[320px] after:left-1/2 after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:opacity-30 after:content-['']"></div>
          <div className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
            <section className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-5xl font-semibold text-white mb-4">Prove solvency without revealing balances</h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                This product helps exchanges and custodians publish privacy-preserving Proofs of solvency.
                Using zero-knowledge proofs, you can demonstrate that liabilities are fully covered by reserves
                without exposing customer balances or public addresses. Generate a proof locally and let anyone verify it against a specific solvency level.
              </p>
            </section>

            <section className="grid gap-4 sm:gap-6 sm:grid-cols-3 mb-10 sm:mb-16">
              <div className="rounded-xl bg-blue-800/60 border border-blue-700 p-5">
                <h3 className="text-green-400 font-medium mb-2">Private by design</h3>
                <p className="text-blue-100 text-sm">Balances and addresses are never revealed. Only a minimal proof is shared.</p>
              </div>
              <div className="rounded-xl bg-blue-800/60 border border-blue-700 p-5">
                <h3 className="text-green-400 font-medium mb-2">Verifiable proofs</h3>
                <p className="text-blue-100 text-sm">Anyone can verify the proof, on-chain or off-chain, in seconds.</p>
              </div>
              <div className="rounded-xl bg-blue-800/60 border border-blue-700 p-5">
                <h3 className="text-green-400 font-medium mb-2">Built for trust</h3>
                <p className="text-blue-100 text-sm">Increase transparency for users and regulators without leaking data.</p>
              </div>
            </section>

            <section className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                text="Generate proof"
                link="/generate"
                linkStyles="block w-full sm:w-auto"
                buttonStyles="w-full sm:w-auto py-4 px-6 text-lg font-medium text-gray-900 bg-green-400 rounded-lg hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-green-400/50"
              />
              <Button
                text="Verify"
                link="/verify"
                linkStyles="block w-full sm:w-auto"
                buttonStyles="w-full sm:w-auto py-4 px-6 text-lg font-medium text-gray-900 bg-blue-400 rounded-lg hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-blue-400/50"
              />
            </section>
          </div>
        </div>
      </main>

      <footer className="w-full">
        <div className="mx-auto max-w-5xl flex items-center justify-center gap-8 py-8">
          <a
            href="https://github.com/grooooaaaark/zks"
            target="_blank"
            rel="noreferrer"
            className="text-blue-100 hover:text-white transition"
            aria-label="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-10 w-10 fill-current">
              <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 9.68.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.92-.64.07-.63.07-.63 1.02.07 1.56 1.07 1.56 1.07.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.2 9.2 0 0 1 2.5-.34c.85 0 1.71.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.95-2.34 4.81-4.57 5.07.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .27.18.58.69.48A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
            </svg>
          </a>
          <a
            href="https://linktr.ee/thomas_grkcodes"
            target="_blank"
            rel="noreferrer"
            className="text-blue-100 hover:text-white transition"
            aria-label="Linktree"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-10 w-10 fill-current">
              <path d="M12 2c.6 0 1.08.48 1.08 1.08v6.39l3.18-3.18a1.08 1.08 0 1 1 1.52 1.54L14.6 11l3.18 3.18a1.08 1.08 0 1 1-1.52 1.54L13.08 12.6v6.32a1.08 1.08 0 1 1-2.16 0V12.6L7.9 15.72a1.08 1.08 0 1 1-1.52-1.54L9.56 11 6.38 7.82a1.08 1.08 0 1 1 1.52-1.54l3.02 3.02V3.08C10.92 2.48 11.4 2 12 2z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
