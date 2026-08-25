# SiteSentry

**SiteSentry** is an AI-powered construction project report (DPR) auditor. Upload a construction project report as a PDF, and a panel of specialist AI + rule-based agents reviews it for engineering risks, cost realism, timeline feasibility, regulatory compliance, and safety — returning a structured scorecard, an overall Go / Revise / No-Go recommendation, and a color-annotated copy of the original PDF highlighting the issues found.

---

## ✨ Features

- **Multi-agent report review** — five specialist agents (Engineering, Cost, Timeline, Compliance, Safety) each analyze the report from their own angle.
- **RAG-based retrieval** — the report is chunked and embedded into a vector store so each agent only reasons over the sections relevant to it.
- **Hybrid deterministic + LLM analysis**:
  - Cost figures are extracted via regex and benchmarked against reference cost-per-sqft data by project type and city tier.
  - Project timelines are stress-tested with a Monte Carlo simulation over typical construction phase durations.
  - Regulatory compliance is checked against a keyword-based checklist (building permit, fire NOC, environmental clearance, soil test, etc.) before being handed to the LLM for a fuller assessment.
- **Reviewer synthesis** — a final "reviewer" agent consolidates all specialist outputs into a 0–100 risk score, a Go/Revise/No-Go call, top critical issues, and an executive summary.
- **Annotated PDF output** — findings are mapped back onto the original PDF as color-coded highlights (one color per agent category) with a legend, so reviewers can see exactly where each concern originates.
- **Simple web UI** — upload a report, pick project type and city tier, and view results without touching the API directly.

---

## 🏗️ Architecture

```
SiteSentry/
├── backend/                  # FastAPI service — the analysis pipeline
│   ├── app.py                 # API entrypoint (upload, analyze, download)
│   ├── src/
│   │   ├── orchestrator.py    # Coordinates the full pipeline end-to-end
│   │   ├── loader.py          # PDF loading + chunking
│   │   ├── vectorstore.py     # ChromaDB storage & retrieval per report
│   │   ├── llm_engine.py      # Groq LLM client wrapper
│   │   ├── agents.py          # Engineering / Timeline / Compliance / Safety / Reviewer agents
│   │   ├── cost_engine.py     # Deterministic cost-per-sqft extraction & benchmarking
│   │   ├── schedule_simulator.py  # Monte Carlo timeline risk simulation
│   │   ├── compliance_checklist.py # Rule-based regulatory checklist
│   │   ├── report_annotator.py     # Annotates the PDF with color-coded findings
│   │   └── benchmarks/cost_data.json
│   ├── uploads/               # Temporary storage for incoming PDFs
│   ├── outputs/                # Annotated PDFs ready for download
│   └── requirements.txt
│
└── frontend/                  # React + Vite single-page app
    └── src/
        ├── App.jsx             # Home → Upload → Results flow
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── UploadPage.jsx  # File upload + project type / city tier selection
        │   └── ResultsPage.jsx
        └── components/
            ├── AgentScorecard.jsx  # Per-agent findings & risk display
            └── ReportViewer.jsx    # Viewer for the annotated PDF
```

### Pipeline flow

1. **Upload** — a PDF report is submitted via the API (or the web UI).
2. **Load & chunk** — the PDF is parsed and split into overlapping text chunks (`loader.py`).
3. **Embed & store** — chunks are embedded (`all-MiniLM-L6-v2`) and stored in a per-report ChromaDB collection (`vectorstore.py`).
4. **Agent panel** — each specialist agent retrieves the chunks relevant to it and produces an assessment, blending LLM reasoning with deterministic checks where applicable (`agents.py`, `cost_engine.py`, `schedule_simulator.py`, `compliance_checklist.py`).
5. **Reviewer synthesis** — a final LLM pass combines all agent outputs into an overall risk score and recommendation.
6. **Annotation (optional)** — `report_annotator.py` marks up the original PDF with color-coded highlights per finding category.
7. **Response** — the scorecard (and, if requested, the annotated PDF) is returned to the client.

---

## 🧰 Tech Stack

**Backend**
- Python, [FastAPI](https://fastapi.tiangolo.com/), Uvicorn
- [LangChain](https://www.langchain.com/) (PDF loading, text splitting)
- [ChromaDB](https://www.trychroma.com/) + `sentence-transformers` for vector storage/retrieval
- [Groq](https://groq.com/) API (`llama-3.1-8b-instant`) for LLM reasoning
- PyMuPDF (`fitz`) for PDF annotation
- NumPy for the Monte Carlo schedule simulation

**Frontend**
- React 19 + Vite
- Axios for API calls
- Recharts for data visualization

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- A [Groq API key](https://console.groq.com/)

### Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Run the API:

```bash
uvicorn app:app --reload
```

The API will be available at `http://localhost:8000`.

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/analyze` | Upload a PDF report (`file`), plus optional `project_type` and `city_tier` form fields. Returns the agent scorecard. |
| `POST` | `/analyze-and-annotate` | Same as above, but also generates a color-annotated copy of the PDF and returns its filename. |
| `GET` | `/download/{filename}` | Downloads the annotated PDF generated for a given original filename. |

**Example request:**

```bash
curl -X POST http://localhost:8000/analyze-and-annotate \
  -F "file=@sample_report.pdf" \
  -F "project_type=residential" \
  -F "city_tier=tier_2"
```

**Example response shape:**

```json
{
  "report_id": "a1b2c3d4",
  "project_type": "residential",
  "city_tier": "tier_2",
  "total_chunks": 42,
  "agents": {
    "engineering": "...",
    "cost": { "status": "REALISTIC", "range": { "min": 1500, "max": 2200 }, "value": 1800 },
    "timeline": "...",
    "compliance": { "building_permit": { "present": true, "status": "FOUND" }, "...": "..." },
    "safety": "...",
    "reviewer": "..."
  },
  "annotated_filename": "sample_report.pdf"
}
```

---

## 🧩 The Agent Panel

| Agent | Type | What it checks |
|---|---|---|
| **Engineering** | LLM | Structural design, foundation, materials, missing specifications |
| **Cost** | Deterministic | Extracts cost-per-sqft figures and benchmarks them against expected ranges by project type / city tier |
| **Timeline** | Deterministic + LLM | Monte Carlo simulation of phase durations vs. stated project timeline, plus LLM risk narrative |
| **Compliance** | Deterministic + LLM | Checklist of required Indian regulatory approvals (building permit, fire NOC, environmental clearance, soil test, etc.), plus LLM narrative |
| **Safety** | LLM | Safety provisions, environmental risks, site hazards |
| **Reviewer** | LLM | Synthesizes all of the above into a risk score, Go/Revise/No-Go call, top issues, and executive summary |

---

## 🗺️ Roadmap Ideas

- [ ] Support for additional LLM providers
- [ ] Configurable/expandable compliance checklists per region
- [ ] Persistent report history and comparison across revisions
- [ ] Authentication and multi-user support

---

## 📄 License

No license file is currently included in this repository — add one (e.g., MIT) if you intend for others to reuse this code.

---

## 🙋 Notes

This project is under active development; some modules (e.g. `chunking.py`) are placeholders and several files contain in-progress or duplicated code (see `requirements.txt`). Contributions and issue reports are welcome.