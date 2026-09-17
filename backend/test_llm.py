from src.llm_engine import LLMEngine

llm = LLMEngine()
response = llm.chat(
    system_prompt = "You are a construction project analyst.",
    user_message="In one sentence, what is the main risk in a construction project?"
)

print(response)
