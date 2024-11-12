import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { ProofData } from '@noir-lang/backend_barretenberg';
import { NoirBackend } from '@/src/utils/noir-backend';

export function useProofGeneration(inputs?: { [key: string]: any }) {
    const [proofData, setProofData] = useState<ProofData | undefined>();
    const [zkBackend, setZkBackend] = useState<NoirBackend | undefined>();

    const proofGeneration = async () => {
        if (!inputs) return;

        console.log('Proof generation starting :)');

        // console.log('Using circuit ', zkBackend!.name());

        if (!zkBackend) {
            // const backend = new NoirBackend('../../circuits/zks');
            console.log('Backend not initialized');
            const backend = new NoirBackend('zks');
            await backend.init();
            setZkBackend(backend);
        }

        debugger;

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

    return { proofData }
}