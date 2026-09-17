import { useState } from "react";
import axios from "axios";

export default function UploadPage({ onResult, onBack }) {
  const [file, setFile] = useState(null);
  const [projectType, setProjectType] = useState("residential");
  const [cityTier, setCityTier] = useState("tier_2");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  const messages = [
    "Extracting and chunking PDF...",
    "Building vector index...",
    "Running Engineering Agent...",
    "Running Cost Realism Agent...",
    "Running Timeline Agent...",
    "Running Compliance Agent...",
    "Running Safety Agent...",
    "Reviewer Agent synthesizing results...",
    "Annotating PDF with findings...",
    "Almost done..."
  ];

  const handleAnalyze = async () => {
    if (!file) return alert("Please select a PDF");
    setLoading(true);

    let i = 0;
    setLoadingMsg(messages[0]);
    const interval = setInterval(() => {
      i = Math.min(i + 1, messages.length - 1);
      setLoadingMsg(messages[i]);
    }, 4000);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("project_type", projectType);
      form.append("city_tier", cityTier);
      const res = await axios.post("http://localhost:8000/analyze-and-annotate", form);
      clearInterval(interval);
      onResult(res.data);
    } catch (err) {
      clearInterval(interval);
      alert("Error: " + err.message);
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "0.75rem 1rem",
    borderRadius: "8px", border: "1px solid #e0e0e0",
    fontSize: "0.95rem", background: "#f9f9f9",
    outline: "none", boxSizing: "border-box"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <div style={{ background: "white", padding: "1rem 2rem",
        display: "flex", alignItems: "center", gap: "1rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <button onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer",
            fontSize: "1.2rem", color: "#1a1a2e" }}>←</button>
        <span style={{ fontWeight: "800", fontSize: "1.2rem" }}>
          Site<span style={{ color: "#e94560" }}>Sentry</span>
        </span>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", alignItems: "center",
        justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "white", borderRadius: "16px",
          padding: "2.5rem", width: "100%", maxWidth: "520px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

          {!loading ? (
            <>
              <h2 style={{ margin: "0 0 0.5rem", color: "#1a1a2e", fontSize: "1.6rem" }}>
                Upload Project Report
              </h2>
              <p style={{ color: "#888", marginBottom: "2rem", fontSize: "0.95rem" }}>
                Upload a construction DPR PDF for AI-powered risk assessment
              </p>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", marginBottom: "6px",
                  fontWeight: "600", fontSize: "0.9rem", color: "#1a1a2e" }}>
                  PDF Report *
                </label>
                <input type="file" accept=".pdf"
                  onChange={e => setFile(e.target.files[0])}
                  style={inputStyle} />
                {file && (
                  <p style={{ margin: "6px 0 0", fontSize: "0.8rem", color: "#4CAF50" }}>
                    ✓ {file.name}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", marginBottom: "6px",
                  fontWeight: "600", fontSize: "0.9rem", color: "#1a1a2e" }}>
                  Project Type
                </label>
                <select value={projectType} onChange={e => setProjectType(e.target.value)}
                  style={inputStyle}>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", marginBottom: "6px",
                  fontWeight: "600", fontSize: "0.9rem", color: "#1a1a2e" }}>
                  City Tier
                </label>
                <select value={cityTier} onChange={e => setCityTier(e.target.value)}
                  style={inputStyle}>
                  <option value="tier_1">Tier 1 — Mumbai, Delhi, Pune</option>
                  <option value="tier_2">Tier 2 — Jaipur, Lucknow</option>
                  <option value="tier_3">Tier 3 — Smaller cities</option>
                </select>
              </div>

              <button onClick={handleAnalyze} style={{
                width: "100%", padding: "0.9rem",
                background: "#e94560", color: "white",
                border: "none", borderRadius: "8px",
                fontSize: "1rem", fontWeight: "700",
                cursor: "pointer", letterSpacing: "0.5px"
              }}>
                Analyze Report →
              </button>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{
                width: "60px", height: "60px", border: "4px solid #f0f0f0",
                borderTop: "4px solid #e94560", borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 1.5rem"
              }} />
              <h3 style={{ color: "#1a1a2e", marginBottom: "0.5rem" }}>Analyzing Report</h3>
              <p style={{ color: "#888", fontSize: "0.9rem" }}>{loadingMsg}</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}