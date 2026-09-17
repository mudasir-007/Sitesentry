import { useState } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function ResultsPage({ result, onBack }) {
  const [tab, setTab] = useState("simple");

  if (!result) return null;

  const agents = result.agents || {};

  // Extract compliance score from compliance agent text
  const extractScore = (text, keyword) => {
    if (!text || typeof text !== "string") return 50;
    const match = text.match(/(\d+(\.\d+)?)\s*%/);
    return match ? Math.min(100, parseFloat(match[1])) : 50;
  };

  const extractRiskScore = (text) => {
    if (!text || typeof text !== "string") return 50;
    const match = text.match(/risk score[:\s]+(\d+)/i);
    return match ? parseInt(match[1]) : 60;
  };

  const complianceScore = extractScore(agents.compliance);
  const riskScore = extractRiskScore(agents.reviewer);
  const safetyScore = agents.safety?.includes("HIGH") ? 35 : agents.safety?.includes("MEDIUM") ? 60 : 80;
  const timelineScore = result.agents?.timeline?.includes("HIGH") ? 30 : 70;
  const costScore = (() => {
    if (!agents.cost || typeof agents.cost === "object") return 65;
    return agents.cost.includes("OVERESTIMATED") ? 45 : agents.cost.includes("REALISTIC") ? 80 : 60;
  })();

  const radarData = [
    { metric: "Compliance", score: complianceScore },
    { metric: "Safety", score: safetyScore },
    { metric: "Cost", score: costScore },
    { metric: "Timeline", score: timelineScore },
    { metric: "Low Risk", score: 100 - riskScore },
  ];

  const scoreCards = [
    { label: "Compliance", score: complianceScore, color: complianceScore > 75 ? "#4CAF50" : complianceScore > 50 ? "#FF9800" : "#f44336" },
    { label: "Safety", score: safetyScore, color: safetyScore > 75 ? "#4CAF50" : safetyScore > 50 ? "#FF9800" : "#f44336" },
    { label: "Cost Realism", score: costScore, color: costScore > 75 ? "#4CAF50" : costScore > 50 ? "#FF9800" : "#f44336" },
    { label: "Timeline", score: timelineScore, color: timelineScore > 75 ? "#4CAF50" : timelineScore > 50 ? "#FF9800" : "#f44336" },
    { label: "Overall Risk", score: 100 - riskScore, color: riskScore < 40 ? "#4CAF50" : riskScore < 70 ? "#FF9800" : "#f44336" },
  ];

  const agentColors = {
    engineering: "#2196F3", cost: "#4CAF50",
    timeline: "#FF9800", compliance: "#9C27B0",
    safety: "#f44336", reviewer: "#1a1a2e"
  };

  const agentIcons = {
    engineering: "🏗️", cost: "💰",
    timeline: "📅", compliance: "📋",
    safety: "⛑️", reviewer: "🔍"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Navbar */}
      <div style={{ background: "white", padding: "1rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={onBack} style={{ background: "none", border: "none",
            cursor: "pointer", fontSize: "1.2rem", color: "#1a1a2e" }}>←</button>
          <span style={{ fontWeight: "800", fontSize: "1.2rem" }}>
            Site<span style={{ color: "#e94560" }}>Sentry</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <a href={`http://localhost:8000/download/${result.annotated_filename}`}
            target="_blank" rel="noreferrer"
            style={{ padding: "0.5rem 1rem", background: "#1a1a2e", color: "white",
              borderRadius: "6px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "600" }}>
            ⬇ Download Annotated PDF
          </a>
        </div>
      </div>

      {/* Report meta */}
      <div style={{ background: "#1a1a2e", color: "white", padding: "1rem 2rem",
        display: "flex", gap: "2rem", fontSize: "0.85rem" }}>
        <span>Report ID: <strong>{result.report_id}</strong></span>
        <span>Type: <strong>{result.project_type}</strong></span>
        <span>City Tier: <strong>{result.city_tier}</strong></span>
        <span>Chunks analyzed: <strong>{result.total_chunks}</strong></span>
      </div>

      {/* Tab toggle */}
      <div style={{ background: "white", padding: "0 2rem",
        borderBottom: "1px solid #eee", display: "flex", gap: "0" }}>
        {["simple", "technical"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "1rem 2rem", border: "none", background: "none",
            cursor: "pointer", fontWeight: "600", fontSize: "0.95rem",
            color: tab === t ? "#e94560" : "#888",
            borderBottom: tab === t ? "3px solid #e94560" : "3px solid transparent",
            transition: "all 0.2s"
          }}>
            {t === "simple" ? "📊 Overview Dashboard" : "🔧 Technical Detail"}
          </button>
        ))}
      </div>

      <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
        {tab === "simple" && (
          <>
            {/* Score cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
              gap: "1rem", marginBottom: "2rem" }}>
              {scoreCards.map(({ label, score, color }) => (
                <div key={label} style={{ background: "white", borderRadius: "12px",
                  padding: "1.25rem", textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  borderTop: `4px solid ${color}` }}>
                  <div style={{ fontSize: "2rem", fontWeight: "800", color }}>{score}%</div>
                  <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "4px" }}>{label}</div>
                  <div style={{ marginTop: "8px", height: "6px", background: "#f0f0f0", borderRadius: "3px" }}>
                    <div style={{ width: `${score}%`, height: "100%",
                      background: color, borderRadius: "3px", transition: "width 1s" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Radar chart */}
            <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem",
              marginBottom: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin: "0 0 1rem", color: "#1a1a2e" }}>Risk Radar</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 13, fill: "#1a1a2e" }} />
                  <Radar name="Score" dataKey="score" stroke="#e94560"
                    fill="#e94560" fillOpacity={0.25} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Reviewer summary */}
            <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin: "0 0 1rem", color: "#1a1a2e" }}>🔍 Executive Summary</h3>
              <p style={{ color: "#444", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                {typeof agents.reviewer === "string"
                  ? agents.reviewer.slice(0, 800) + "..."
                  : "No summary available"}
              </p>
            </div>
          </>
        )}

        {tab === "technical" && (
          <div>
            {Object.entries(agents).map(([agent, output]) => (
              <details key={agent} style={{ marginBottom: "1rem", background: "white",
                borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                overflow: "hidden" }} open={agent === "reviewer"}>
                <summary style={{
                  padding: "1rem 1.5rem", cursor: "pointer", fontWeight: "700",
                  background: agentColors[agent], color: "white", fontSize: "0.95rem",
                  listStyle: "none", display: "flex", alignItems: "center", gap: "0.5rem"
                }}>
                  {agentIcons[agent]} {agent.charAt(0).toUpperCase() + agent.slice(1)} Agent
                </summary>
                <div style={{ padding: "1.5rem", whiteSpace: "pre-wrap",
                  fontSize: "0.88rem", lineHeight: "1.7", color: "#333" }}>
                  {typeof output === "object" ? JSON.stringify(output, null, 2) : output}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}