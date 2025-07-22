import { UltraHonkBackend, ProofData } from "@aztec/bb.js";
import { Noir } from '@noir-lang/noir_js';
import zksCircuit from '@Circuits/zks/target/zero_knowledge_solvency.json';

export class NoirBackend {
    private circuitName: string;
    private backend?: UltraHonkBackend;
    private noir?: Noir;

    constructor(circuitName: string) {
        this.circuitName = circuitName;
    }

    async init(): Promise<void> {
        console.log('Initializing NoirBackend ', this.circuitName);

        const noir = new Noir(zksCircuit as any);
        const honk = new UltraHonkBackend((zksCircuit as any).bytecode, {
            threads: 8, // This will only work if SharedArrayBuffer is enabled (see next.config.mjs)
        });

        this.backend = honk;
        this.noir = noir;
    }

    name = () => this.circuitName;

    getNoir = () => this.noir;

    generateWitness = async (inputs: { [key: string]: any }): Promise<{ witness: Uint8Array; returnValue: any }> => {
        const formattedInputs = {
            ...inputs,
            field_message: Array.from(inputs.field_message) as number[],
            field_signature: Array.from(inputs.field_signature) as number[],
            field_pub_key: Array.from(inputs.field_pub_key) as number[],
        };

        return this.noir!.execute(formattedInputs);
    };

    generateProof = async (witness: Uint8Array): Promise<ProofData> => {
        return this.backend!.generateProof(witness);
    };

    verifyOffChain = (proofData: Uint8Array, publicInputs: string[]) => {
        return this.backend!.verifyProof({proof: proofData, publicInputs: publicInputs});
    };

    // TODO: implement
    verifyOnChain = () => {};
}
