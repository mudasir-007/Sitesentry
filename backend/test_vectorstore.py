from src.loader import load_and_chunk_report

from src.vectorstore import ReportVectorStore

chunks = load_and_chunk_report("uploads/sample.pdf")

store = ReportVectorStore()
store.add_chunks(chunks, report_id="sample_report_1")

results = store.query("What is cloud computing?", report_id="sample_report_1", top_k=3)
print(results)

