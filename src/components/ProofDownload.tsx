'use client';

import React from 'react';

interface ProofDownloadProps {
    proofData: Uint8Array | null;
    className?: string;
}

export default function ProofDownload({ proofData, className = '' }: ProofDownloadProps) {
    const handleDownload = () => {
        if (!proofData) return;

        // Convert Uint8Array to blob
        const blob = new Blob([proofData as any], { type: 'application/octet-stream' });

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'zk_proof'; // Extension-free file as requested

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (!proofData) return null;

    return (
        <div className={`bg-gray-800 shadow-lg shadow-green-400/20 rounded-lg p-8 text-center ${className}`}>
            <h2 className="text-2xl font-bold text-green-400 mb-6 glow">
                Your ZK proof is ready !
            </h2>

            {/* File Icon */}
            <div className="mb-6">
                <svg
                    className="w-16 h-16 mx-auto text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            </div>

            {/* Download Button */}
            <button
                onClick={handleDownload}
                className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-green-400 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
                Download Proof
            </button>
        </div>
    );
}
