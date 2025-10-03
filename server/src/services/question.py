import os
import fitz
from typing import List
from http.client import HTTPException
from sqlmodel import Session, select
from src.services import llm
from src.models.course import Course
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)

def load_pdf_with_metadata(filepath: str) -> List[Document]:
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


def ingest_pdfs(filepaths: List[str]) -> Chroma:
    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vectordb = Chroma(
        embedding_function=embedding_model,
        persist_directory=None
    )

    all_docs = []
    for filepath in filepaths:
        if os.path.isfile(filepath) and filepath.lower().endswith(".pdf"):
            docs = load_pdf_with_metadata(filepath)
            all_docs.extend(docs)

    if all_docs:
        vectordb.add_documents(all_docs)

    return vectordb


def ask_question(course_id: int, query: str, session: Session):
    course = session.exec(select(Course).where(Course.id == course_id)).first()

    if not course:
        raise HTTPException(status=404, detail="Course not found")

    filepaths = [f"pdfs/{file.path}{file.name}" for file in course.files]

    vectordb = ingest_pdfs(filepaths)
    retriever = vectordb.as_retriever(search_kwargs={"k": 10})
    docs = retriever.invoke(query)

    context_text = "\n\n".join([f"(Page {d.metadata['page_number']} of {d.metadata['source']}): {d.page_content}" for d in docs])
    prompt = f"Use the following context to answer the question:\n{context_text}\n\nQuestion: {query}"
    answer = llm.get_llm_response(prompt)

    return {"answer": answer, "sources": [d.metadata for d in docs]}
