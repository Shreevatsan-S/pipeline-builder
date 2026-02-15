import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import './nodeStyles.css';

const getTop = (index, total) => `${((index + 1) / (total + 1)) * 100}%`;

const sideToPosition = (side) => (side === 'left' ? Position.Left : Position.Right);

const Handles = ({ handles, side }) => {
  if (!handles?.length) return null;

  return handles.map((handle, index) => (
    <div
      className={`node-handle node-handle-${side}`}
      key={handle.id}
      style={{ top: getTop(index, handles.length) }}
    >
      <Handle
        type={handle.type}
        position={sideToPosition(side)}
        id={handle.id}
      />
      {handle.label ? (
        <span className={`handle-label handle-label-${side}`}>{handle.label}</span>
      ) : null}
    </div>
  ));
};

export const NodeCard = ({ title, subtitle, accent = '#2563eb', children, handles = [], style = {} }) => {
  const leftHandles = handles.filter((h) => h.side === 'left');
  const rightHandles = handles.filter((h) => h.side === 'right');

  return (
    <div className="node-card" style={{ borderColor: accent, ...style }}>
      <div className="node-header" style={{ background: accent }}>
        <div className="node-title">{title}</div>
        {subtitle ? <div className="node-subtitle">{subtitle}</div> : null}
      </div>
      <div className="node-body">{children}</div>
      <Handles handles={leftHandles} side="left" />
      <Handles handles={rightHandles} side="right" />
    </div>
  );
};

const renderField = (field, value, onChange) => {
  const handleChange = (nextValue) => {
    const parsed = field.type === 'number' ? Number(nextValue) : nextValue;
    onChange(field.name, parsed);
  };

  const commonProps = {
    id: field.name,
    name: field.name,
    value: value ?? '',
    className: 'field-control',
    onChange: (e) => handleChange(e.target.value),
    placeholder: field.placeholder,
  };

  if (field.type === 'select') {
    return (
      <select {...commonProps}>
        {field.options?.map((opt) => (
          <option value={opt} key={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'textarea') {
    return <textarea {...commonProps} rows={field.rows || 3} />;
  }

  return <input {...commonProps} type={field.type || 'text'} />;
};

export const createNodeComponent = (definition) => {
  return ({ id, data }) => {
    const updateNodeField = useStore((state) => state.updateNodeField);
    const fields = definition.fields || [];

    const getValue = (field) => {
      const defaultValue =
        typeof field.defaultValue === 'function' ? field.defaultValue(id) : field.defaultValue;
      return data?.[field.name] ?? defaultValue ?? '';
    };

    const mappedHandles = (definition.handles || []).map((handle) => ({
      ...handle,
      id: `${id}-${handle.id}`,
    }));

    return (
      <NodeCard
        title={definition.title}
        subtitle={definition.subtitle}
        accent={definition.accent}
        handles={mappedHandles}
      >
        <div className="node-fields">
          {fields.map((field) => (
            <label className="field" key={field.name} htmlFor={field.name}>
              <span className="field-label">{field.label}</span>
              {renderField(field, getValue(field), updateNodeField.bind(null, id))}
              {field.hint ? <span className="field-hint">{field.hint}</span> : null}
            </label>
          ))}
        </div>
      </NodeCard>
    );
  };
};
