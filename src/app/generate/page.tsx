'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { createPublicClient, createWalletClient,  custom, formatEther, recoverPublicKey, keccak256, toBytes } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

import { useProofGeneration } from '@/hooks/useProofGeneration';

export default function GenerateProofPage() {
    // const [address, setAddress] = useState('');
    const [inputs, setInputs] = useState<{ [key: string]: any }>();
    const [proofData, setProofData] = useState<{ [key: string]: any }>();

    const address = useAccount().address;
    const [formData, setFormData] = useState({
        address: address,
        solvencyLevel: '',
        token: 'Ether (Ethereum Mainnet)', //TODO: defaults to wallet network's default token
    });

    const inputUpdate = async(inputs: { [key: string]: any }) => {
        setInputs(inputs);
        setProofData(useProofGeneration(inputs));
    };

    useEffect(() => {
        if (address) {
            setFormData(prev => ({ ...prev, address }))
        }
    }, [address])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const generateRawMessage = (balance: number | bigint | string): string => {

        const localTs: number = Date.now();

        var rawMessage = 'You need to connect and use the address with the balance you\'re trying to prove';
        rawMessage += '\nThe day is ' + +localTs.toString();
        rawMessage += '\n balance at this time: ' + balance;

        return rawMessage;

    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const confirmedAddress = formData.address!;

        // Request account access first
        try {
            await window.ethereum!.request({
                method: 'eth_requestAccounts'
            });

            const publicClient = createPublicClient({
                chain: sepolia,
                transport: custom(window.ethereum!),
            });

            const walletClient = createWalletClient({
                chain: sepolia,
                transport: custom(window.ethereum!),
                account: confirmedAddress,
            });

            const balance = await publicClient.getBalance({
                address: confirmedAddress,
            });

            const balanceInWei = BigInt(balance);
            const formattedBalance = formatEther(balance);
            const balanceInGWeiForMessage = balanceInWei / BigInt(1000000000);

            // Generate message
            const rawMessage = generateRawMessage(`${balanceInGWeiForMessage} GWei`);

            // Sign the message - this will automatically add Ethereum prefix and hash it
            const signature = await walletClient.signMessage({
                account: confirmedAddress,
                message: rawMessage,
            });

            // Create the Ethereum message hash that was actually signed
            // This follows EIP-191 standard: keccak256("\x19Ethereum Signed Message:\n" + message.length + message)
            const prefix = `\x19Ethereum Signed Message:\n${rawMessage.length}`;
            const fullMessage = prefix + rawMessage;
            const messageHash = keccak256(toBytes(fullMessage));

            // Get the message hash bytes (should be exactly 32 bytes)
            const hashBytes = toBytes(messageHash);
            if (hashBytes.length !== 32) {
                throw new Error(`Message hash must be 32 bytes, got ${hashBytes.length}`);
            }

            // Get signature components (should be exactly 65 bytes: r + s + v)
            const rawSignature = toBytes(signature);
            if (rawSignature.length !== 65) {
                throw new Error(`Signature must be 65 bytes, got ${rawSignature.length}`);
            }

            // Recover public key using the Ethereum message hash (for verification)
            const publicKey = await recoverPublicKey({
                hash: messageHash,
                signature: signature
            });

            // Get public key bytes (should be exactly 65 bytes: prefix + x + y)
            const rawPubKey = toBytes(publicKey);
            if (rawPubKey.length !== 65 || rawPubKey[0] !== 4) {
                throw new Error(`Public key must be 65 bytes with 0x04 prefix, got ${rawPubKey.length} bytes with prefix ${rawPubKey[0]}`);
            }

            // Prepare circuit inputs - use direct array conversion to avoid copying issues
            const messageBytes = Array.from(hashBytes);
            const signatureBytes = Array.from(rawSignature.slice(0, 64)); // r + s only
            const pubKeyBytes = Array.from(rawPubKey.slice(1, 65)); // x + y only

            // Convert balance from Wei to GWei for better i64 range compatibility
            // 1 ETH = 1e18 Wei = 1e9 GWei
            const balanceInGWei = balanceInWei / BigInt(1000000000); // Convert Wei to GWei (divide by 1e9)

            // Solvency level should also be in GWei units (user input assumed to be in GWei)
            const solvencyInGWei = BigInt(formData.solvencyLevel);

            // Validate and convert to i64-compatible strings
            const balanceI64String = balanceInGWei.toString();
            const solvencyI64String = solvencyInGWei.toString();

            const inputs = {
                field_message: messageBytes,
                field_signature: signatureBytes,
                field_pub_key: pubKeyBytes,
                field_total_balance: balanceI64String,
                field_solvency: solvencyI64String,
            };

            console.log('Debug info:');
            console.log('Original message:', rawMessage);
            console.log('Message with prefix:', fullMessage);
            console.log('Message hash (hex):', messageHash);
            console.log('Message hash bytes for circuit:', messageBytes);
            console.log('Signature (hex):', signature);
            console.log('Signature bytes for circuit (first 8):', signatureBytes.slice(0, 8));
            console.log('Public key (hex):', publicKey);
            console.log('Public key bytes for circuit (first 8):', pubKeyBytes.slice(0, 8));
            console.log('Inputs ready for zk circuit:', inputs);
            setInputs(inputs);
        } catch (error) {
            console.error('Error connecting to wallet:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <header className="w-full max-w-4xl flex justify-between items-center mb-8">
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                Back to Home
            </Link>
            {/* <WalletConnect /> */}
            </header>
            <main className="w-full max-w-4xl bg-gray-800 shadow-lg shadow-green-400/20 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-green-400 mb-6 glow">Generate Proof</h1>
            <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                <label htmlFor="address" className="block text-sm font-medium text-green-400">
                    Address
                </label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                />
                </div>
                <div>
                <label htmlFor="solvencyLevel" className="block text-sm font-medium text-green-400">
                    Solvency Level (GWei)
                </label>
                <input
                    type="number"
                    id="solvencyLevel"
                    name="solvencyLevel"
                    value={formData.solvencyLevel}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 remove-arrow"
                    inputMode="numeric"
                    required
                />
                </div>
                <div>
                <label htmlFor="token" className="block text-sm font-medium text-green-400">
                    Token
                </label>
                <select
                    id="token"
                    name="token"
                    value={formData.token}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                    <option>Ether (Ethereum Mainnet)</option>
                    {/* Add more token options here */}
                </select>
                </div>
                <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-green-400 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                    Generate Proof
                </button>
            </form>
        </main>
    </div>
    );
};
