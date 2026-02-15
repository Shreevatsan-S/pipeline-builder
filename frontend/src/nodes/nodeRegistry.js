import { createNodeComponent } from './nodeFactory';
import { TextNode } from './textNode';

export const nodeDefinitions = {
  customInput: {
    title: 'Input',
    label: 'Input',
    subtitle: 'Pipeline entry',
    accent: '#7c3aed',
    defaults: (id) => ({
      inputName: id.replace('customInput-', 'input_'),
      inputType: 'Text',
    }),
    fields: [
      { name: 'inputName', label: 'Name', placeholder: 'input_1' },
      { name: 'inputType', label: 'Type', type: 'select', options: ['Text', 'File'] },
    ],
    handles: [{ id: 'value', type: 'source', side: 'right', label: 'value' }],
  },
  llm: {
    title: 'LLM',
    label: 'LLM',
    subtitle: 'Prompt + system',
    accent: '#f59e0b',
    defaults: () => ({ model: 'gpt-4', temperature: 0.5 }),
    fields: [
      { name: 'model', label: 'Model', type: 'select', options: ['gpt-4', 'gpt-4o', 'gpt-3.5'] },
      { name: 'temperature', label: 'Temperature', type: 'number', defaultValue: 0.5, hint: '0 - 1 range' },
    ],
    handles: [
      { id: 'system', type: 'target', side: 'left', label: 'system' },
      { id: 'prompt', type: 'target', side: 'left', label: 'prompt' },
      { id: 'response', type: 'source', side: 'right', label: 'response' },
    ],
  },
  customOutput: {
    title: 'Output',
    label: 'Output',
    subtitle: 'Expose result',
    accent: '#10b981',
    defaults: (id) => ({
      outputName: id.replace('customOutput-', 'output_'),
      outputType: 'Text',
    }),
    fields: [
      { name: 'outputName', label: 'Name', placeholder: 'output_1' },
      { name: 'outputType', label: 'Type', type: 'select', options: ['Text', 'Image'] },
    ],
    handles: [{ id: 'value', type: 'target', side: 'left', label: 'value' }],
  },
  http: {
    title: 'HTTP Request',
    label: 'HTTP',
    subtitle: 'Call an API',
    accent: '#3b82f6',
    defaults: () => ({ url: 'https://api.example.com', method: 'GET' }),
    fields: [
      { name: 'url', label: 'URL', placeholder: 'https://api.example.com' },
      { name: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'] },
    ],
    handles: [
      { id: 'payload', type: 'target', side: 'left', label: 'payload' },
      { id: 'response', type: 'source', side: 'right', label: 'response' },
    ],
  },
  delay: {
    title: 'Delay',
    label: 'Delay',
    subtitle: 'Wait then continue',
    accent: '#a855f7',
    defaults: () => ({ delayMs: 1000 }),
    fields: [
      { name: 'delayMs', label: 'Delay (ms)', type: 'number', defaultValue: 1000, hint: 'Pause before emitting output' },
    ],
    handles: [
      { id: 'input', type: 'target', side: 'left', label: 'in' },
      { id: 'output', type: 'source', side: 'right', label: 'out' },
    ],
  },
  branch: {
    title: 'Branch',
    label: 'Branch',
    subtitle: 'Route by condition',
    accent: '#ef4444',
    defaults: () => ({ condition: 'response.status === 200' }),
    fields: [
      { name: 'condition', label: 'Condition', placeholder: 'response.status === 200' },
    ],
    handles: [
      { id: 'input', type: 'target', side: 'left', label: 'input' },
      { id: 'true', type: 'source', side: 'right', label: 'true' },
      { id: 'false', type: 'source', side: 'right', label: 'false' },
    ],
  },
  vectorSearch: {
    title: 'Vector Search',
    label: 'Search',
    subtitle: 'Find similar chunks',
    accent: '#14b8a6',
    defaults: () => ({ indexName: 'documents', topK: 3 }),
    fields: [
      { name: 'indexName', label: 'Index', placeholder: 'documents' },
      { name: 'topK', label: 'Top K', type: 'number', defaultValue: 3 },
    ],
    handles: [
      { id: 'query', type: 'target', side: 'left', label: 'query' },
      { id: 'results', type: 'source', side: 'right', label: 'results' },
    ],
  },
  code: {
    title: 'Code',
    label: 'Code',
    subtitle: 'Run snippet',
    accent: '#f472b6',
    defaults: () => ({ language: 'JavaScript', snippet: 'return input;' }),
    fields: [
      { name: 'language', label: 'Language', type: 'select', options: ['JavaScript', 'Python', 'SQL'] },
      { name: 'snippet', label: 'Snippet', type: 'textarea', rows: 3, defaultValue: 'return input;' },
    ],
    handles: [
      { id: 'input', type: 'target', side: 'left', label: 'input' },
      { id: 'output', type: 'source', side: 'right', label: 'output' },
    ],
  },
  text: {
    title: 'Text',
    label: 'Text',
    subtitle: 'Dynamic template',
    accent: '#0ea5e9',
    defaults: () => ({ text: '{{input}}' }),
    component: TextNode,
  },
};

const generated = Object.entries(nodeDefinitions).reduce((acc, [type, definition]) => {
  if (definition.component) {
    acc[type] = definition.component;
    return acc;
  }

  acc[type] = createNodeComponent(definition);
  return acc;
}, {});

export const nodeTypes = generated;

export const getDefaultData = (type, id) => {
  const definition = nodeDefinitions[type];
  if (!definition) return { id, nodeType: type };

  const defaults = typeof definition.defaults === 'function' ? definition.defaults(id) : definition.defaults;
  return { id, nodeType: type, ...(defaults || {}) };
};

export const nodePalette = Object.entries(nodeDefinitions)
  .filter(([, def]) => def.label)
  .map(([type, def]) => ({ type, label: def.label, accent: def.accent }));
