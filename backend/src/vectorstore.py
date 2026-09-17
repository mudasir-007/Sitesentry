import chromadb
from chromadb.utils import embedding_functions

class ReportVectorStore:
    """
    Wraps ChromaDB to store and query chunks from an uploaded
    construction project report.
    """

    def __init__(self, persist_dir: str = "chroma_db", collection_name: str= "site_reports"):
        # PersistentClient saves data to disk automatically - no maual 
        self.client = chromadb.PersistentClient(path=persist_dir)

        #uisng sentence-transforemers under the hod, same embedding model
        self.embedding_fn= embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )


        self.collection= self.client.get_or_create_collection(
            name=collection_name,
            embedding_function= self.embedding_fn
        )

    def add_chunks(self, chunks, report_id: str):
        """
        Adds chunks from a LangChain document loader into the collection.
        report_id : a unique identifier so chunks from different reports 
                    don't get mized up in queries.
        """


        documents = [c.page_content for c in chunks]
        ids = [f"{report_id}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [{"report_id": report_id, "page": c.metadata.get("page", -1)} for c in chunks]

        self.collection.add(
            documents= documents,
            ids= ids,
            metadatas= metadatas
        )


    def query(self, query_text: str, report_id : str, top_k: int = 5):
        """
        Retrieves the top_k most relevant chunks for a query,
        scoped to a specific report.
        """
        results = self.collection.query(
            query_texts=[query_text],
            n_results=top_k,
            where={"report_id": report_id}
        )
        return results