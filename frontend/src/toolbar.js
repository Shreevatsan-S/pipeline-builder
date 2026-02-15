// toolbar.js

import { DraggableNode } from './draggableNode';
import { nodePalette } from './nodes/nodeRegistry';

export const PipelineToolbar = () => {

    return (
        <div className="toolbar">
            <div className="toolbar-header">
                <div className="toolbar-title">Node Library</div>
                <div className="toolbar-subtitle">Drag and drop to build your pipeline</div>
            </div>
            <div className="palette-grid">
                {nodePalette.map((node) => (
                    <DraggableNode key={node.type} type={node.type} label={node.label} accent={node.accent} />
                ))}
            </div>
        </div>
    );
};
