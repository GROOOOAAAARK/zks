import { decompressSync } from 'fflate';
import { BarretenbergBackend, ProofData } from '@noir-lang/backend_barretenberg';
import { compile, createFileManager } from '@noir-lang/noir_wasm';
import { CompiledCircuit } from '@noir-lang/types';
import { executeCircuit, compressWitness } from "@noir-lang/acvm_js";
import { Noir } from '@noir-lang/noir_js';

export class NoirBackend {
    private circuit: any;
    private circuitPath: string;
    private backend: BarretenbergBackend;
    private backendOptions: any;
    private noir: Noir;

    constructor(circuitPath: string, backendOptions?: any) {
        this.circuitPath = circuitPath;
        this.backendOptions = backendOptions
            ? backendOptions
            : { threads: navigator.hardwareConcurrency };
    }

    async init() {
        const fm = createFileManager('/');
        const circuit = (await fetch(new URL(
            `${this.circuitPath}/src/main.nr`, import.meta.url
        ))).body as ReadableStream<Uint8Array>;
        const nargoFile = (await fetch(new URL(
            `${this.circuitPath}/Nargo.toml`, import.meta.url
        ))).body as ReadableStream<Uint8Array>

        fm.writeFile('./src/main.nr', circuit);
        fm.writeFile('./Nargo.toml', nargoFile);
        const compiledCircuit = await compile(fm);

        if (!('program' in compiledCircuit)) {
            throw new Error('Circuit compilation error...');
        }
        this.circuit = compiledCircuit.program as CompiledCircuit;
        this.backend = new BarretenbergBackend(
            this.circuit,
            this.backendOptions
        );
        this.noir = new Noir(this.circuit, this.backend);
    }

    // getNoir = (): Noir => {
    //     return new Noir(this.circuit, this.backend);
    // }

    generateProof = (inputs: { [key: string]: any }): Promise<ProofData> => {
        return this.noir.generateProof(inputs);
    };

    verifyOffChain = () => {};

    verifyOnChain = () => {};
}
