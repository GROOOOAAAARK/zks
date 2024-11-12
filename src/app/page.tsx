'use client';
import Image from "next/image";
import Button from "@/src/components/Buttons";
import { useState } from 'react';
import { NoirBackend } from "@/src/utils/noir-backend";

export default function Home() {

  const [zkBackend, setZkBackend] = useState<NoirBackend>(new NoirBackend('zks')); //TODO: handle path in var

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-green-400 glow">Zero Knowledge Solvency</h1>
        {/* <WalletConnect /> */}
      </header>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col items-center">
          <Button text="Generate proof" link="/generate" linkStyles="block" buttonStyles="w-full py-4 px-6 text-lg font-medium text-gray-900 bg-green-400 rounded-lg hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-green-400/50"/>
          <Button text="Verify" link="/verify" linkStyles="block" buttonStyles="w-full py-4 px-6 text-lg font-medium text-gray-900 bg-blue-400 rounded-lg hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-blue-400/50" />
        </div>
        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>

      </main>
    </div>
  );
}
