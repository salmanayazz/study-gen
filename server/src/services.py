import os
import fitz
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import Ollama
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from ollama import Client

embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
persist_dir = "./chroma_db"
vectordb = Chroma(embedding_function=embedding_model, persist_directory=persist_dir)

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)

client = Client(
  host='http://localhost:11434',
)

def load_pdf_with_metadata(filepath):
    documents = []
    pdf = fitz.open(filepath)

    for page_num in range(len(pdf)):
        page = pdf.load_page(page_num)
        text = page.get_text("text")
        images = page.get_images(full=True)

        print("*************")
        print(f"File: {filepath}, Page: {page_num + 1}")
        print("Text content: ", text)

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