// draggableNode.js

export const DraggableNode = ({ type, label, accent = '#1C2536' }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className="palette-item"
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        style={{ background: `linear-gradient(135deg, ${accent}, #0f172a)` }}
        draggable
      >
          <span className="palette-label">{label}</span>
      </div>
    );
  };
  