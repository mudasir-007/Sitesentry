from src.loader import load_and_chunk_report

chunks = load_and_chunk_report("uploads/sample.pdf")

print(f"Total chunks created: {len(chunks)}")
print("\n--- First chunk ---")
print(chunks[0].page_content)
print("\n--- Metadata of first chunk ---")
print(chunks[0].metadata)

print(f"\n--- Chunk length check ---")
for i, c in enumerate(chunks[:5]):
    print(f"Chunk {i}: {len(c.page_content)} characters")