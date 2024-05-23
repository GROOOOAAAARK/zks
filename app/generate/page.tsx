'use client';

import React, { useState } from 'react';

import { BrowserProvider, formatEther, hexlify, keccak256, SigningKey, toBeArray } from 'ethers';

import { useProofGeneration } from '@/hooks/useProofGeneration';

import { stringToUints8 } from '@/utils/conversions';

export default function GenerateProofPage() {
    const [address, setAddress] = useState('');
    const [solvencyAmount, setSolvencyAmount] = useState('');

    const generateRawMessage = (balance: string): string => {

        const localTs: number = Date.now();

        var rawMessage = 'You need to connect and use the address with the balance you\'re trying to prove';
        rawMessage += '\nThe day is ' + localTs as unknown as string;
        rawMessage += '\n balance at this time: ' + balance;

        return rawMessage;

    }

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
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

            // Verify the user's balance
            const balance = formatEther(await web3Provider.getBalance(address));

            console.log('Balance:', balance);

            // Generate a random message to be signed
            const rawMessage = generateRawMessage(balance);

            // const hashedMessage = keccak256(stringToUints8(rawMessage));

            const bytesMessage = stringToUints8(rawMessage).subarray(0, 32); //TODO: lost of data here, find another way

            console.log('Hashed message:', rawMessage);
            console.log('Size bytes message:', bytesMessage.byteLength);

            // Ask the user to sign the message using MetaMask
            const signature = await signer.signMessage(bytesMessage);

            console.log('Signature:', signature);

            // Get the public key
            const pubKey = SigningKey.recoverPublicKey(bytesMessage, signature); //TODO: digest should only be 32 bytes long, message may be too long or malformed

            console.log('Pub key:', pubKey);

            // call the circuit to generate proof and display it to the user

            const inputs = {
                message: bytesMessage,
                signature: stringToUints8(signature),
                pub_key: stringToUints8(pubKey),
                totalBalance: balance,
                solvency: solvencyAmount,
            };

            console.log('Inputs ready for zk circuit:', JSON.stringify(inputs));

        } catch (error) {
            console.error('Connection x Signing error:', error);
        }
    };

    return (
        <div>
            <h1>Input Address and Solvency Amount</h1>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor="address">Address:</label>
                    <input
                        style={{color: 'black'}}
                        type="text"
                        id="address"
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="solvencyAmount">Solvency Amount:</label>
                    <input
                        style={{color: 'black'}}
                        type="text"
                        id="solvencyAmount"
                        value={solvencyAmount}
                        onChange={(event) => setSolvencyAmount(event.target.value)}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};
