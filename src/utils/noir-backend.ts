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

    init(): void {
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

    generateWitness = async (inputs: any): Promise<{ witness: Uint8Array; returnValue: any }> => {
        return this.noir!.execute(inputs);
    };

    generateProof = async (witness: Uint8Array): Promise<ProofData> => {
        return this.backend!.generateProof(witness);
    };

    verifyOffChain = (proofData: ProofData) => {
        return this.backend!.verifyProof(proofData);
    };

    // TODO: implement
    verifyOnChain = () => {};
}
