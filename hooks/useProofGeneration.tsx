import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { ProofData } from '@noir-lang/backend_barretenberg';
import { NoirBackend } from '@/utils/noir-backend.js';

export function useProofGeneration(inputs?: { [key: string]: any }) {
    const [proofData, setProofData] = useState<ProofData | undefined>();
    const [zkBackend, setZkBackend] = useState<NoirBackend | undefined>();

    const proofGeneration = async () => {
        if (!inputs) return;

        const data = await toast.promise(zkBackend!.generateProof(inputs), {
            pending: 'Generating Proof...',
            success: 'Proof generated...',
            error: 'Error while generating proof...',
        });

        setProofData(data);
    };

    useEffect(() => {
        if (!inputs) return;
        proofGeneration();
    }, [inputs])
}