'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import type { ProofData } from '@aztec/bb.js';
import { useProofVerification } from '@/hooks/useProofVerification';

type VerificationInputs = { proofData: Uint8Array; publicInputs: string[] } | null;

export default function ZeroKnowledgeProofPage() {
    const [storedProofData, setStoredProofData] = useState<ProofData | null>(null);
    const [proofBytes, setProofBytes] = useState<Uint8Array | null>(null);
    const [droppedFileName, setDroppedFileName] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const [solvencyField, setSolvencyField] = useState('');
    const [verificationInputs, setVerificationInputs] = useState<VerificationInputs>(null);

    const { verificationResult, isVerifying } = useProofVerification(verificationInputs);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const readFileToUint8Array = async (file: File): Promise<Uint8Array> => {
        const buffer = await file.arrayBuffer();
        return new Uint8Array(buffer);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        try {
            const file = e.dataTransfer.files?.[0];
            if (!file) return;
            const bytes = await readFileToUint8Array(file);
            if (!bytes || bytes.length === 0) {
                toast.error('Dropped file is empty');
                return;
            }
            setProofBytes(bytes);
            setDroppedFileName(file.name || 'zk_proof');
            toast.success('Proof file loaded');
        } catch (err) {
            toast.error('Failed to read file');
        }
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const bytes = await readFileToUint8Array(file);
            if (!bytes || bytes.length === 0) {
                toast.error('Selected file is empty');
                return;
            }
            setProofBytes(bytes);
            setDroppedFileName(file.name || 'zk_proof');
            toast.success('Proof file loaded');
        } catch (_) {
            toast.error('Failed to read file');
        }
    };

    const toHexString = (value: string): string => {
        const trimmed = value.trim();
        if (trimmed.startsWith('0x') || trimmed.startsWith('0X')) {
            if (/^0x[0-9a-fA-F]+$/.test(trimmed)) return trimmed.toLowerCase();
            throw new Error('Invalid hex string');
        }
        if (!/^\d+$/.test(trimmed)) throw new Error('Solvency must be a positive integer or a 0x-hex string');
        return '0x' + BigInt(trimmed).toString(16);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!proofBytes) {
                throw new Error('Please drop a proof file before verifying');
            }
            const solvencyHex = toHexString(solvencyField);
            if (typeof solvencyHex !== 'string' || !/^0x[0-9a-fA-F]+$/.test(solvencyHex)) {
                throw new Error('Transformed solvency must be a hex string');
            }

            setVerificationInputs({ proofData: proofBytes, publicInputs: [solvencyHex] });
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Invalid inputs';
            toast.error(msg);
        }
    };

    const statusText = useMemo(() => {
        if (isVerifying) return 'Verifying proof...';
        if (verificationResult === true) return 'Proof is valid! ✅';
        if (verificationResult === false) return 'Proof is invalid! ❌';
        return '';
    }, [isVerifying, verificationResult]);

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <header className="w-full max-w-4xl flex justify-between items-center mb-8">
                <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                    Back to Home
                </Link>
            </header>
            <main className="w-full max-w-4xl bg-gray-800 shadow-lg shadow-blue-400/20 rounded-lg p-8">
                <h1 className="text-2xl font-bold text-blue-400 mb-6 glow">Verify Proof</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-blue-400">Zero Knowledge Proof</label>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`mt-1 w-full border-2 ${isDragging ? 'border-blue-400' : 'border-gray-600'} border-dashed rounded-md py-8 px-3 bg-gray-700 text-blue-400 flex flex-col items-center justify-center cursor-pointer transition-colors`}
                        >
                            {/* Icon changes when file is loaded */}
                            {!proofBytes ? (
                                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6H16a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            ) : (
                                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            )}
                            <p className="mt-3 text-sm text-center">
                                {proofBytes ? (droppedFileName || 'zk_proof loaded') : 'Drop your proof file here or click to select'}
                            </p>
                            <input type="file" onChange={handleFileInput} className="hidden" />
                        </div>
                        <p className="mt-2 text-xs text-gray-400">Drop the raw proof file you downloaded. Only raw binary is supported.</p>
                    </div>
                    <div>
                        <label htmlFor="solvency" className="block text-sm font-medium text-blue-400">
                            Solvency
                        </label>
                        <input
                            type="text"
                            id="solvency"
                            value={solvencyField}
                            onChange={(e) => setSolvencyField(e.target.value)}
                            placeholder="Decimal or 0x-hex"
                            className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-blue-400 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        disabled={isVerifying}
                    >
                        {isVerifying ? 'Verifying...' : 'Verify Proof'}
                    </button>
                </form>
                {statusText && (
                    <div className="mt-6 text-center text-green-400">{statusText}</div>
                )}
            </main>
        </div>
    );
}