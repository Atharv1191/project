import { useState } from "react";
import axios from "axios";
import "./App.css";

const SIGNAL_CONFIG = {
  buying_interest: { label: "Buying Interest", color: "#0F6E56", bg: "#E1F5EE", border: "#1D9E75" },
  objection:       { label: "Objection",        color: "#A32D2D", bg: "#FCEBEB", border: "#E24B4A" },
  confusion:       { label: "Confusion",         color: "#854F0B", bg: "#FAEEDA", border: "#EF9F27" },
  stall:           { label: "Stall Signal",      color: "#854F0B", bg: "#FAEEDA", border: "#EF9F27" },
};

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyse = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError("");
    setSignals([]);
    try {
      const res = await axios.post("https://project-drab-eight-13.vercel.app/analyse", { transcript });
      setSignals(res.data.signals || []);
    } catch (err) {
      setError("Something went wrong. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Meeting Signal Detector</h1>
        <p>Paste a sales call transcript and get AI-detected signals with coaching tips.</p>
      </div>

      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder={`Rep: Pricing is $499/seat/month.\nProspect: That seems steep. We pay under $200 currently.\nRep: If your team closes one extra deal per quarter, it pays for itself 10x.\nProspect: Send me a pricing deck and I'll get back to you.`}
        rows={8}
      />

      <button onClick={analyse} disabled={loading || !transcript.trim()}>
        {loading ? "Analysing..." : "Analyse Transcript"}
      </button>

      {error && <p className="error">{error}</p>}

      {signals.length > 0 && (
        <div className="results">
          <p className="results-label">{signals.length} signal{signals.length > 1 ? "s" : ""} detected</p>
          <div className="cards">
            {signals.map((signal, i) => {
              const config = SIGNAL_CONFIG[signal.type] || SIGNAL_CONFIG["confusion"];
              return (
                <div key={i} className="card" style={{ borderLeftColor: config.border }}>
                  <span className="badge" style={{ background: config.bg, color: config.color }}>
                    {config.label}
                  </span>
                  <p className="quote">"{signal.quote}"</p>
                  <p className="tip">💡 {signal.tip}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}