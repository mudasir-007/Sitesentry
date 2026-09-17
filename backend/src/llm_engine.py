import os 
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class LLMEngine:
    """
    Wrapper around Groq API.
    Handles client inintialization, model selection, and error handling.
    """

    def __init__(self, model: str = "llama-3.1-8b-instant"):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API KEY Not found in environment variables")
        
        self.client = Groq(api_key=api_key)
        self.model = model


    def chat(self, system_prompt: str, user_message: str, temperature: float = 0.2):
        """
        Sends a message to the LLm and returns the response text.

        temperature: low(0.2) = more focused/deterministic output,
                     which is what we want for structured analysis,
                     not creative writing
        """
        
        try:
            response = self.client.chat.completions.create(
                model= self.model,
                messages= [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature = temperature
            )
            return response.choices[0].message.content
        
        except Exception as e:
            return f"LLM Error: {str(e)}"
        
        