function AgentScorecard({ result }) {
  const agentColors = {
    engineering: "#2196F3",
    cost: "#4CAF50",
    timeline: "#FF9800",
    compliance: "#9C27B0",
    safety: "#F44336",
    reviewer: "#1a1a2e"
  };

  const agentIcons = {
    engineering: "🏗️",
    cost: "💰",
    timeline: "📅",
    compliance: "📋",
    safety: "⛑️",
    reviewer: "🔍"
  };

  return (
    <div>
      <div style={{ background: "#1a1a2e", color: "white", padding: "1rem",
        borderRadius: "10px", marginBottom: "1.5rem" }}>
        <p style={{ margin: 0 }}>Report ID: <strong>{result.report_id}</strong></p>
        <p style={{ margin: 0 }}>Chunks analyzed: <strong>{result.total_chunks}</strong></p>
        <p style={{ margin: 0 }}>Project type: <strong>{result.project_type}</strong> | City tier: <strong>{result.city_tier}</strong></p>
      </div>

      {Object.entries(result.agents).map(([agent, output]) => (
        <div key={agent} style={{ marginBottom: "1.5rem", border: `2px solid ${agentColors[agent]}`,
          borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ background: agentColors[agent], color: "white",
            padding: "0.75rem 1rem", fontWeight: "bold", fontSize: "1rem" }}>
            {agentIcons[agent]} {agent.charAt(0).toUpperCase() + agent.slice(1)} Agent
          </div>
          <div style={{ padding: "1rem", whiteSpace: "pre-wrap", fontSize: "0.9rem", lineHeight: "1.6" }}>
            {typeof output === "object" ? JSON.stringify(output, null, 2) : output}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AgentScorecard;