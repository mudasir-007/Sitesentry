from src.loader import load_and_chunk_report
from src.vectorstore import ReportVectorStore
from src.agents import AgentPanel
import uuid 
import os

class Orchestrator:
    """

    Main pipeline coordinator for SiteSentry.
    Handles: PDF loading -> chunking -> storing -> running agents -> returning scorecard.
    """


    def __init__(self):
        self.store= ReportVectorStore()
        self.panel= AgentPanel()

    def process(self, pdf_path: str, project_type: str ="residential", city_tier: str ="tier_2"):
        """
        Full pipeline from PDF upload to final scorecard.
        Returns structured result with all agent outputs.
        """

        # Step 1: Load and chunk
        chunks = load_and_chunk_report(pdf_path)
        if not chunks:
            return {"error": "Could not extract text from PDF"}

        # Step 2: Generate unique report ID
        report_id = str(uuid.uuid4())[:8]

        # Step 3: Store in ChromaDB
        self.store.add_chunks(chunks, report_id=report_id)

        # Step 4: Build full text for deterministic layers
        full_text = " ".join([c.page_content for c in chunks])

        # Step 5: Run agent panel
        results = self.panel.run(report_id, full_text)

        return {
            "report_id": report_id,
            "project_type": project_type,
            "city_tier": city_tier,
            "total_chunks": len(chunks),
            "agents": results
        }