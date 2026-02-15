# Pipeline Builder

A visual node-based editor for creating and validating data processing pipelines. Built with React and FastAPI, it provides an intuitive interface for designing directed acyclic graphs (DAGs).

## Features

- **Visual Node Editor**: Drag-and-drop interface for building pipelines
- **Node Types**: Input, Output, Text, and LLM nodes
- **DAG Validation**: Ensures pipelines are valid directed acyclic graphs
- **Real-time Rendering**: Powered by Reactflow

## Project Structure

```
├── frontend/          # React application
│   └── src/
│       ├── nodes/     # Node definitions and styles
│       ├── App.js     # Main app component
│       └── ui.js      # UI components
├── backend/           # FastAPI server
│   └── main.py        # API endpoints and DAG validation
└── README.md
```

## Prerequisites

- **Node.js** 14+ (for frontend)
- **Python** 3.8+ (for backend)

## Installation & Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## Building for Production

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

- `POST /pipeline/validate` - Validate a pipeline DAG

## License

MIT
