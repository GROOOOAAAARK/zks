'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { BrowserProvider, formatEther, hexlify, keccak256, SigningKey, toBeArray } from 'ethers';
import { useAccount } from 'wagmi'

import { useProofGeneration } from '@/hooks/useProofGeneration';
import { stringToUints8 } from '@/utils/conversions';

export default function GenerateProofPage() {
    // const [address, setAddress] = useState('');
    const [inputs, setInputs] = useState<{ [key: string]: any }>();
    const [proofData, setProofData] = useState<{ [key: string]: any }>();

    const address = useAccount().address;
    const [formData, setFormData] = useState({
        address: '',
        solvencyLevel: '',
        token: 'Ether (Ethereum Mainnet)', //TODO: defaults to wallet network's default token
    })

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

    const generateRawMessage = (balance: string): string => {

        const localTs: number = Date.now();

        var rawMessage = 'You need to connect and use the address with the balance you\'re trying to prove';
        rawMessage += '\nThe day is ' + localTs as unknown as string;
        rawMessage += '\n balance at this time: ' + balance;

        return rawMessage;

    };

    const handleFormSubmit = async (event: React.FormEvent) => { //TODO: integrate wagmi here
        event.preventDefault();

        try {
            const confirmedAddress = address!;
            // Check if MetaMask is installed
            if (typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask is not installed');
            }

            // Request user's permission to access their accounts
            await window.ethereum.enable();

            console.log('MetaMask is installed and enabled');

            // Create a new instance of Web3 using the injected provider from MetaMask
            const web3Provider = new BrowserProvider(window.ethereum);
            const signer = await web3Provider.getSigner();

            console.log('Web3 provider and signer created');

            // Obtain the user's balance
            const balance = formatEther(await web3Provider.getBalance(confirmedAddress));

            console.log('Balance:', balance);

            // Generate a random message to be signed
            const rawMessage = generateRawMessage(balance);

            // const hashedMessage = keccak256(stringToUints8(rawMessage));

            const bytesMessage = stringToUints8(rawMessage).subarray(0, 32); //TODO: lost of data here, find another way
            console.log(`\n\n\nARRAY OF LENGTH: ${bytesMessage.length}\n\n`);

            // console.log('Raw message:', rawMessage);
            // // console.log('Size bytes message:', bytesMessage.byteLength);

            // Ask the user to sign the message using MetaMask
            const signature = await signer.signMessage(bytesMessage);
            // const signature = await signer.signMessage(rawMessage);

            console.log('Signature:', signature);
            // const bytesSignature = stringToUints8(signature).subarray(0, 32);
            // console.log('Size signature:', bytesSignature.byteLength);

            // Get the public key
            // const pubKey = SigningKey.recoverPublicKey(bytesMessage, signature); //TODO: digest should only be 32 bytes long, message may be too long or malformed
            const pubKey = SigningKey.recoverPublicKey(rawMessage, signature);

            console.log('Pub key:', pubKey);
            // console.log('Size pub key:', stringToUints8(pubKey).byteLength);

            // Sets inputs right before generating the proof

            const inputs = {
                field_message: rawMessage,
                field_signature: signature,
                field_pub_key: pubKey,
                filed_total_balance: balance,
                field_solvency: formData.solvencyLevel,
                // field_message: bytesMessage,
                // field_signature: bytesSignature,
                // field_pub_key: stringToUints8(pubKey).subarray(0, 32),
                // filed_total_balance: balance,
                // field_solvency: formData.solvencyLevel,
            };

            console.log('Inputs ready for zk circuit:', JSON.stringify(inputs));

            // Calls the circuit to generate proof and display it to the user

            inputUpdate(inputs);

        } catch (error) {
            console.error('Connection x Signing error:', error);
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
                    Solvency Level
                </label>
                <input
                    type="number"
                    id="solvencyLevel"
                    name="solvencyLevel"
                    value={formData.solvencyLevel}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
    //     <div>
    //         <h1>Input Address and Solvency Amount</h1>
    //         <form onSubmit={handleFormSubmit}>
    //             <div>
    //                 <label htmlFor="address">Address:</label>
    //                 <input
    //                     style={{color: 'black'}}
    //                     type="text"
    //                     id="address"
    //                     value={address}
    //                     onChange={(event) => setAddress(event.target.value)}
    //                 />
    //             </div>
    //             <div>
    //                 <label htmlFor="solvencyAmount">Solvency Amount:</label>
    //                 <input
    //                     style={{color: 'black'}}
    //                     type="text"
    //                     id="solvencyAmount"
    //                     value={solvencyAmount}
    //                     onChange={(event) => setSolvencyAmount(event.target.value)}
    //                 />
    //             </div>
    //             <button type="submit">Submit</button>
    //         </form>
    //     </div>
    // );
};
