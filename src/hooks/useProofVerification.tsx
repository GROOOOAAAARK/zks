import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { NoirBackend } from '@/utils/noir-backend';
import type { ProofData } from '@aztec/bb.js';

interface VerificationInputs {
    proofData: Uint8Array;
    publicInputs: string[];
}

export function useProofVerification(inputs: VerificationInputs | null) {
    const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    const initializeBackend = async () => {
        const { NoirBackend } = await import("@/utils/noir-backend");
        const backend = new NoirBackend("zks");
        backend.init();
        return backend;
    };

    const proofVerification = async (zkBackend: NoirBackend) => {
        if (!inputs) return;

        // inputs.proofData is Uint8Array; inputs.publicInputs is string[]
        // Build the ProofData object expected by the backend
        const proofData: ProofData = {
            proof: inputs.proofData,
            publicInputs: inputs.publicInputs,
        } as unknown as ProofData;

        setIsVerifying(true);

        try {
            console.log("Verifying proof with inputs:", {
                proofDataLength: inputs.proofData.length,
                publicInputsCount: inputs.publicInputs.length,
                publicInputs: inputs.publicInputs
            });

            const result = await toast.promise(
                Promise.resolve(zkBackend.verifyOffChain(proofData)),
                {
                    pending: 'Verifying proof...',
                    success: 'Proof verification completed!',
                    error: 'Error while verifying proof...',
                }
            );

            console.log("\n\n======verification result======\n\n", result);
            setVerificationResult(result);

            if (result) {
                toast.success('Proof is valid! ✅');
            } else {
                toast.error('Proof is invalid! ❌');
            }
        } catch (error) {
            console.error('Proof verification failed:', error);
            toast.error(`Proof verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setVerificationResult(false);
        } finally {
            setIsVerifying(false);
        }
    };

    useEffect(() => {
        if (!inputs) {
            setVerificationResult(null);
            setIsVerifying(false);
            return;
        }

        initializeBackend().then((backend) => {
            proofVerification(backend);
        });
    }, [inputs]);

    return {
        verificationResult,
        isVerifying
    };
}
