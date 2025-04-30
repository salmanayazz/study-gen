import os
import fitz
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import Ollama
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from ollama import Client
import json
import re

embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
persist_dir = "./chroma_db"
vectordb = Chroma(embedding_function=embedding_model, persist_directory=persist_dir)
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
client = Client(host='http://localhost:11434')

question_generation_prompt = """
You are an exam question generator. Given the content of a single textbook or lecture page 
(which may include diagrams, data, and written explanation), generate unique exam-style (2-3 would be ideal)
questions that a teacher might ask based on the material.
Each question should include:
    - The question text.
    - The correct answer.
    - Multiple-choice options if the question fits that format.
Return the output as a JSON array using the following structure:

[
    {
        "question": "What is ...?",
        "answer": "Option A",
        "options": ["Option A", "Option B", "Option C", "Option D"]
    },
    {
        "question": "Explain the concept of ...",
        "answer": "The correct explanation."
    }
]

The multiple choice questions should be trivia while the open-ended questions should be more conceptual.
Focus on conceptual clarity and comprehension. Keep each question self-contained and understandable without the full document.
Here is the page content:

"""

def load_pdf_with_metadata(filepath):
    documents = []
    pdf = fitz.open(filepath)

    for page_num in range(len(pdf)):
        page = pdf.load_page(page_num)
        text = page.get_text("text")
        metadata = {
            "source": os.path.basename(filepath),
            "page_number": page_num + 1,
        }

        page_doc = Document(page_content=text, metadata=metadata)
        split_docs = splitter.split_documents([page_doc])
        documents.extend(split_docs)

    return documents

def ingest_pdfs_from_folder(folder_path):
    all_docs = []
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(".pdf"):
            full_path = os.path.join(folder_path, filename)
            print(f"Ingesting {filename}...")
            docs = load_pdf_with_metadata(full_path)
            all_docs.extend(docs)

    if all_docs:
        vectordb.add_documents(all_docs)
        vectordb.persist()
        print(f"Ingested {len(all_docs)} total chunks.")
    else:
        print("No PDF documents found.")

def create_qa_chain():
    retriever = vectordb.as_retriever(search_kwargs={"k": 5})
    llm = Ollama(model="gemma3:4b-it-qat")
    chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )
    return chain

def ask_question(query):
    ingest_pdfs_from_folder("pdfs")
    chain = create_qa_chain()
    result = chain(query)
    print(f"\nAnswer: {result['result']}")
    print("\nSources:")
    for doc in result['source_documents']:
        meta = doc.metadata
        print(f"- Page {meta['page_number']} from {meta['source']}")

def create_study_plan():
    folder_path = "pdfs"
    questions = []
    temp_dir = "temp_images"
    os.makedirs(temp_dir, exist_ok=True)

    for filename in os.listdir(folder_path):
        if filename.lower().endswith(".pdf"):
            full_path = os.path.join(folder_path, filename)
            pdf = fitz.open(full_path)
            print(f"Processing {filename}...")

            for page_num in range(len(pdf)):
                page = pdf.load_page(page_num)
                page_content = page.get_text("text")
                images = page.get_images(full=True)

                print(f"Page {page_num + 1} content: {page_content}")

                image_paths = []
                for img_info in images:
                    xref = img_info[0]
                    base_image = page.parent.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    image_path = os.path.join(temp_dir, f"page_image_{xref}.{image_ext}")
                    with open(image_path, "wb") as f:
                        f.write(image_bytes)
                    image_paths.append(image_path)

                response = client.chat(
                    model="gemma3:4b-it-qat",
                    messages=[
                        {
                            "role": "user",
                            "content": question_generation_prompt + page_content,
                            "images": image_paths
                        }
                    ]
                )

                for image_path in image_paths:
                    os.remove(image_path)

                question_set = response['message']['content']
                print(f"\nGenerated Questions:\n{question_set}\n")

                try:
                    cleaned = re.sub(r'```json|```|```', '', question_set).strip()
                    questions.append(json.loads(cleaned))
                except json.JSONDecodeError:
                    print("Failed to parse JSON response. Skipping this page.")
                    continue
                

    return questions
