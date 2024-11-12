import { BarretenbergBackend, ProofData } from '@noir-lang/backend_barretenberg';
import { CompiledCircuit } from '@noir-lang/types';
import { Noir } from '@noir-lang/noir_js';
import zksCircuit from '@circuits/zks/target/zero_knowledge_solvency.json';

export class NoirBackend {
    private circuitName: string;
    private circuit?: CompiledCircuit;
    private backend?: BarretenbergBackend;
    private backendOptions: any;
    private noir?: Noir;

    constructor(circuitName: string, backendOptions?: any) {
        this.circuitName = circuitName;
        this.backendOptions = backendOptions;
            // ? backendOptions
            // : { threads: navigator.hardwareConcurrency };
    }

    async init(): Promise<void> {
        console.log('Initializing NoirBackend ', this.circuitName);

        this.circuit = zksCircuit as CompiledCircuit;
        this.backend = new BarretenbergBackend(
            this.circuit,
            this.backendOptions,
        );
        debugger;
        this.noir = new Noir(this.circuit, this.backend);
    }

    name = () => this.circuitName;

    getNoir = () => this.noir;

    generateProof = (inputs: { [key: string]: any }): Promise<ProofData> => {
        debugger;
        return this.noir!.generateProof(inputs);
    };

    verifyOffChain = () => {};

    verifyOnChain = () => {};
}
