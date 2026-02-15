// textNode.js

import { useEffect, useMemo, useState } from 'react';
import { NodeCard } from './nodeFactory';
import { useStore } from '../store';

const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][\w$]*)\s*\}\}/g;

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currText, setCurrText] = useState(data?.text ?? '{{input}}');

  useEffect(() => {
    updateNodeField(id, 'text', currText);
  }, [id, currText, updateNodeField]);

  const variables = useMemo(() => {
    const names = new Set();
    let match;
    while ((match = VARIABLE_REGEX.exec(currText)) !== null) {
      names.add(match[1]);
    }
    return Array.from(names);
  }, [currText]);

  const lines = currText.split('\n');
  const longestLine = Math.max(12, ...lines.map((line) => line.length));
  const dynamicWidth = Math.min(440, Math.max(240, longestLine * 8 + 60));
  // Ensure enough vertical space for variable handles and content
  const minByVariables = variables.length > 0 ? variables.length * 40 + 120 : 150;
  const dynamicHeight = Math.min(420, Math.max(minByVariables, lines.length * 26 + 90));

  const handles = [
    ...variables.map((name) => ({
      id: `${id}-var-${name}`,
      type: 'target',
      side: 'left',
      label: `{{${name}}}`,
    })),
    { id: `${id}-output`, type: 'source', side: 'right', label: 'out' },
  ];

  return (
    <NodeCard
      title="Text"
      subtitle="Dynamic template"
      accent="#0ea5e9"
      handles={handles}
      style={{ width: dynamicWidth, minHeight: dynamicHeight }}
    >
      <label className="field" htmlFor={`${id}-text`}>
        <span className="field-label">Template</span>
        <textarea
          id={`${id}-text`}
          className="field-control"
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
          style={{ width: '100%', minHeight: dynamicHeight - 90 }}
          placeholder="Hello {{name}}"
        />
        <span className="field-hint">Use double braces to declare inputs. Handles appear automatically.</span>
      </label>
    </NodeCard>
  );
};
