import time
from src.orchestrator import Orchestrator

pipeline = Orchestrator()

start = time.time()
result = pipeline.process("uploads/sample_construction_dpr.pdf")
end = time.time()

print(f"Total time: {round(end - start, 1)} seconds")