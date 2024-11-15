'use client';

import { useState } from 'react';

export default function ZeroKnowledgeProofPage() {
    const [proof, setProof] = useState('');
    const [solvency, setSolvency] = useState('');

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log('Proof:', proof);
        console.log('Solvency:', solvency);

        //TODO: Call the circuit to verify the proof
    };

    return (
        <div>
            <h1>Zero Knowledge Proof Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="proof">Zero Knowledge Proof:</label>
                    <input
                        type="text"
                        id="proof"
                        value={proof}
                        onChange={(e) => setProof(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="solvency">Solvency:</label>
                    <input
                        type="text"
                        id="solvency"
                        value={solvency}
                        onChange={(e) => setSolvency(e.target.value)}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}