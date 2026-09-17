from src.loader import load_and_chunk_report
from src.vectorstore import ReportVectorStore
from src.agents import AgentPanel


#load and store
chunks = load_and_chunk_report("uploads/sample_construction_dpr.pdf")

store = ReportVectorStore()
store.add_chunks(chunks, report_id="test_001")



#Run agents

full_text = " ".join([c.page_content for c in chunks])
panel = AgentPanel()
results = panel.run("test_001", full_text)

for agent, result in results.items():
    print(f"\n{'='*20} {agent.upper()} {'='*20}")
    print(result)