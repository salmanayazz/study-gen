from typing import List
from ollama import Client
from dotenv import load_dotenv
import os
from openai import OpenAI
import base64

load_dotenv()

ollama_client = Client(host=os.getenv("OLLAMA_URL"))
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_llm_response(prompt: str, image_paths: List[str] = []):
  # try ollama, if it fails, try openai
  try:
    response = ollama_client.chat(
      model="gemma3:12b",
      messages=[
        {
          "role": "user",
          "content": prompt,
          "images": image_paths
        }
      ]
    )
    
    return response['message']['content']
  except Exception as e:
    print(f"Error communicating with Ollama: {e}")
  
  try:
    content_blocks = [{"type": "text", "text": prompt}]

    for image_path in image_paths:
      with open(image_path, "rb") as img_file:
        img_b64 = base64.b64encode(img_file.read()).decode("utf-8")
      content_blocks.append({
        "type": "image_url",
        "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}
      })

    resp = openai_client.chat.completions.create(
      model="gpt-4.1",
      messages=[{"role": "user", "content": content_blocks}]
    )

    return resp.choices[0].message.content

  except Exception as e:
    print(f"Error communicating with OpenAI: {e}")
    return None