import { useState } from "react";
import axios from "axios";

function UploadPanel({ setResult, setLoading, setError }) {
  const [file, setFile] = useState(null);
  const [projectType, setProjectType] = useState("residential");
  const [cityTier, setCityTier] = useState("tier_2");

  const handleSubmit = async () => {
    if (!file) return alert("Please select a PDF file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("project_type", projectType);
    formData.append("city_tier", cityTier);

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post("http://localhost:8000/analyze", formData);
      setResult(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f8f9fa", padding: "1.5rem", borderRadius: "10px", marginBottom: "2rem" }}>
      <h2 style={{ marginTop: 0 }}>Upload Project Report</h2>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>PDF Report</label>
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Project Type</label>
          <select value={projectType} onChange={(e) => setProjectType(e.target.value)}
            style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>City Tier</label>
          <select value={cityTier} onChange={(e) => setCityTier(e.target.value)}
            style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}>
            <option value="tier_1">Tier 1 (Mumbai, Delhi, Pune)</option>
            <option value="tier_2">Tier 2 (Jaipur, Lucknow)</option>
            <option value="tier_3">Tier 3 (Smaller cities)</option>
          </select>
        </div>

        <button onClick={handleSubmit}
          style={{ padding: "8px 20px", background: "#e94560", color: "white",
            border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
          Analyze Report
        </button>
      </div>
    </div>
  );
}

export default UploadPanel;