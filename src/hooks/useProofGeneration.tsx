import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { ProofData } from '@aztec/bb.js';
import { NoirBackend } from '@/utils/noir-backend';

export function useProofGeneration(inputs?: { [key: string]: any }) {
    const [proofData, setProofData] = useState<ProofData | undefined>();
    const [zkBackend, setZkBackend] = useState<NoirBackend | undefined>();

    const validateInputs = (inputs: any) => {
        if (!inputs.field_message || !Array.isArray(inputs.field_message) || inputs.field_message.length !== 32) {
            throw new Error('field_message must be a byte array of length 32');
        }
        if (!inputs.field_signature || !Array.isArray(inputs.field_signature) || inputs.field_signature.length !== 64) {
            throw new Error('field_signature must be a byte array of length 64');
        }
        if (!inputs.field_pub_key || !Array.isArray(inputs.field_pub_key) || inputs.field_pub_key.length !== 64) {
            throw new Error('field_pub_key must be a byte array of length 64');
        }
        if (!inputs.field_total_balance || !/^\d+$/.test(inputs.field_total_balance)) {
            throw new Error('field_total_balance must be a valid Field number string');
        }
        if (!inputs.field_solvency || !/^\d+$/.test(inputs.field_solvency)) {
            throw new Error('field_solvency must be a valid Field number string');
        }
    };

    const proofGeneration = async () => {
        if (!inputs) return;

        try {
            validateInputs(inputs);
            console.log('Inputs validated for proof generation');

        } catch (error) {
            console.error('Input validation failed:', error);
            toast.error('Invalid inputs for proof generation');
            return;
        }

        try {
            const { witness } = await zkBackend!.generateWitness(inputs);

            const data = await toast.promise(zkBackend!.generateProof(witness), {
                pending: 'Generating Proof...',
                success: 'Proof generated...',
                error: 'Error while generating proof...',
            });

            setProofData(data);
        } catch (error) {
            console.error('Proof generation failed:', error);
            toast.error('Error while generating proof');
            return;
        }
    };

    useEffect(() => {
        if (!inputs) return;
        proofGeneration();
    }, [inputs]);

    return { proofData }
}