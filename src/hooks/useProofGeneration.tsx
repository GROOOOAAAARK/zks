import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { ProofData } from '@aztec/bb.js';
import { NoirBackend } from '@/utils/noir-backend';

export function useProofGeneration(inputs: any) {
    const [proofData, setProofData] = useState<ProofData>();
    const [isGenerating, setIsGenerating] = useState(false);

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
        // Validate field_total_balance
        if (!inputs.field_total_balance || !/^\d+$/.test(inputs.field_total_balance)) {
            throw new Error('field_total_balance must be a valid positive number string');
        }
        const balanceValue = BigInt(inputs.field_total_balance);
        const I64_MAX = BigInt('9223372036854775807');
        if (balanceValue > I64_MAX) {
            throw new Error(`field_total_balance value ${balanceValue} exceeds i64 maximum (${I64_MAX})`);
        }

        // Validate field_solvency
        if (!inputs.field_solvency || !/^\d+$/.test(inputs.field_solvency)) {
            throw new Error('field_solvency must be a valid positive number string');
        }
        const solvencyValue = BigInt(inputs.field_solvency);
        if (solvencyValue > I64_MAX) {
            throw new Error(`field_solvency value ${solvencyValue} exceeds i64 maximum (${I64_MAX})`);
        }
    };

    const initializeBackend = async () => {
        const { NoirBackend } = await import("@/utils/noir-backend");
        const backend = new NoirBackend("zks");
        backend.init();
        // setZkBackend(backend);
        return backend;
    };

    const proofGeneration = async (zkBackend: NoirBackend) => {
        if (!inputs) return;

        setIsGenerating(true);

        try {
            validateInputs(inputs);

        } catch (error) {
            console.error('Input validation failed:', error);
            toast.error('Invalid inputs for proof generation');
            setIsGenerating(false);
            return;
        }

        try {
            const { witness, returnValue } = await zkBackend!.generateWitness(inputs);

            const proof = await zkBackend!.generateProof(witness);

            // Store the proof data
            setProofData(proof);

            const verificationResult = await zkBackend!.verifyOffChain(proof);

            toast.success('Proof generated successfully!');
        } catch (error) {
            console.error('Proof generation failed:', error);
            toast.error('Error while generating proof');
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (!inputs) return;
        initializeBackend().then((backend) => {
            proofGeneration(backend);
        });
    }, [inputs]);

    return { proofData, isGenerating }
}