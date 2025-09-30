# StudyGen

StudyGen is an AI-powered study planner and quiz generator.  
Upload your files, break them into structured study sessions, and auto-generate practice questions to stay on top of your learning.

## Getting Started
### Server Setup
**Prerequisites:**
- PostgreSQL
- Python 3 (3.13.1 recommended)
- pip

Install dependencies:
```
pip install -r requirements.txt
```

Create a `.env` file in the root directory with the following contents (replace with your values):
```
FRONTEND_URL=...
DATABASE_URL=...
OLLAMA_URL=...
OPENAI_API_KEY=...
```

Start the server while in the `server` directory:
```
uvicorn src.main:app --reload
```

### Client Setup
**Prerequisites:**
- Node.js (v18.19.0 recommended)
- npm

Install dependencies while in the `client` directory:
```
npm install
```

Start the client:
```
npm run dev
```

