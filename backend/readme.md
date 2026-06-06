# NimitAI — Meeting Signal Detector

A web app that analyses sales call transcripts and detects AI-powered signals like buying interest, objections, and stall signals — with a one-line coaching tip for each.

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **LLM**: DeepSeek (`deepseek-chat`)

## Project Structure

```
nimitai-signal-detector/
├── backend/
│   ├── index.js        # Express server with /analyse endpoint
│   ├── .env            # API keys (not committed)
│   ├── .env.example    # Template for environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   └── App.css
    └── package.json
```

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/nimitai-signal-detector.git
cd nimitai-signal-detector
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and add your DeepSeek API key:

```
DEEPSEEK_API_KEY=your_deepseek_api_key_here
PORT=3001
```

Start the backend:

```bash
node index.js
```

Server will run on `http://localhost:3001`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Paste a sales call transcript in the text area
3. Click **Analyse Transcript**
4. View detected signals with quotes and coaching tips

## API

### `POST /analyse`

**Request:**
```json
{
  "transcript": "Rep: Pricing is $499/seat/month.\nProspect: That seems steep..."
}
```

**Response:**
```json
{
  "signals": [
    {
      "type": "objection",
      "quote": "That seems steep. We pay under $200 currently.",
      "tip": "Acknowledge the price concern and re-anchor to ROI."
    }
  ]
}
```

**Signal types:** `buying_interest`, `objection`, `confusion`, `stall`

## Test Transcript

```
Rep: Pricing is $499/seat/month.
Prospect: That seems steep. We pay under $200 currently.
Rep: If your team closes one extra deal per quarter, it pays for itself 10x.
Prospect: Send me a pricing deck and I'll get back to you.
```