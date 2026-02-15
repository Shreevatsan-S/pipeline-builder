// submit.js

import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
});

export const SubmitButton = () => {
    const { nodes, edges } = useStore(selector, shallow);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }

            const payload = await response.json();
            alert(
                `Nodes: ${payload.num_nodes}\nEdges: ${payload.num_edges}\nIs DAG: ${payload.is_dag ? 'Yes' : 'No'}`
            );
        } catch (err) {
            console.error('Submit failed', err);
            alert('Unable to submit pipeline. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="submit-row">
            <button className="primary-btn" type="button" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Pipeline'}
            </button>
        </div>
    );
};
