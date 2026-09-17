from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

def load_and_chunk_report(path: str, chunk_size: int= 1000, chunk_overlap: int=150):
    """
    Loads a construction project report PDF and splits it into
    overlapping chunks suitable for embedding + retrieval.

    chunk_size: max characters per chunk
    chunk_overlap: characters shared between consecutive chunks,
                   so context isn't lost at chunk boundaries

    """
    loader= PyPDFLoader(path)
    pages = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size = chunk_size,
        chunk_overlap= chunk_overlap,
        separators= ["\n\n", "\n", ". ", " ", ""]
    )
    
    chunks= splitter.split_documents(pages)
    return chunks


